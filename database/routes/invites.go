package routes

import (
	"net/http"
	"strings"
	"time"

	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
)

type createInviteReq struct {
	TTLSeconds int `json:"ttlSeconds"`
}

type createInvitesByEmailReq struct {
	Emails     []string `json:"emails"`
	TTLSeconds int      `json:"ttlSeconds"`
}

// Invites registers invite-by-link endpoints.
func Invites(se *core.ServeEvent) {
	// POST /api/room/{roomId}/invite
	se.Router.POST("/api/room/{roomId}/invite", func(e *core.RequestEvent) error {
		roomId := e.Request.PathValue("roomId")
		if roomId == "" {
			return e.JSON(http.StatusBadRequest, map[string]any{"message": "Missing roomId"})
		}
		if e.Auth == nil || e.Auth.Id == "" {
			return e.JSON(http.StatusUnauthorized, map[string]any{"message": "Unauthorized"})
		}

		// fetch room and verify permissions (creator or admin)
		room, err := se.App.FindRecordById("rooms", roomId)
		if err != nil || room == nil {
			return e.JSON(http.StatusNotFound, map[string]any{"message": "Room not found"})
		}
		if !isCreatorOrAdmin(room, e.Auth.Id) {
			return e.JSON(http.StatusForbidden, map[string]any{"message": "Forbidden"})
		}

		// parse TTL
		body := createInviteReq{}
		_ = e.BindBody(&body)
		ttl := clampTTL(body.TTLSeconds)
		expiresAt := time.Now().Add(time.Duration(ttl) * time.Second)

		// create invite (untargeted)
		invCol, err := se.App.FindCollectionByNameOrId("room_invites")
		if err != nil {
			return e.JSON(http.StatusInternalServerError, map[string]any{"message": "Invites collection missing"})
		}
		inv := core.NewRecord(invCol)
		inv.Set("room", roomId)
		inv.Set("created_by", e.Auth.Id)
		inv.Set("expires_at", expiresAt)
		// untargeted -> target_email left empty

		if err := se.App.Save(inv); err != nil {
			return e.JSON(http.StatusInternalServerError, map[string]any{"message": "Failed to create invite"})
		}

		url := "/invite/" + inv.Id
		return e.JSON(http.StatusOK, map[string]any{
			"token":     inv.Id,
			"url":       url,
			"roomId":    roomId,
			"expiresAt": expiresAt,
		})
	}).Bind(apis.RequireAuth())

	// POST /api/room/{roomId}/invites/by-email
	se.Router.POST("/api/room/{roomId}/invites/by-email", func(e *core.RequestEvent) error {
		roomId := e.Request.PathValue("roomId")
		if roomId == "" {
			return e.JSON(http.StatusBadRequest, map[string]any{"message": "Missing roomId"})
		}
		if e.Auth == nil || e.Auth.Id == "" {
			return e.JSON(http.StatusUnauthorized, map[string]any{"message": "Unauthorized"})
		}

		room, err := se.App.FindRecordById("rooms", roomId)
		if err != nil || room == nil {
			return e.JSON(http.StatusNotFound, map[string]any{"message": "Room not found"})
		}
		if !isCreatorOrAdmin(room, e.Auth.Id) {
			return e.JSON(http.StatusForbidden, map[string]any{"message": "Forbidden"})
		}

		body := createInvitesByEmailReq{}
		if err := e.BindBody(&body); err != nil {
			return e.JSON(http.StatusBadRequest, map[string]any{"message": "Invalid body"})
		}
		if len(body.Emails) == 0 {
			return e.JSON(http.StatusBadRequest, map[string]any{"message": "No emails provided"})
		}
		// dedupe + normalize
		const maxBulk = 100
		dedup := make(map[string]struct{}, len(body.Emails))
		emails := make([]string, 0, len(body.Emails))
		for _, em := range body.Emails {
			em = strings.TrimSpace(strings.ToLower(em))
			if em == "" {
				continue
			}
			if _, ok := dedup[em]; ok {
				continue
			}
			dedup[em] = struct{}{}
			emails = append(emails, em)
			if len(emails) >= maxBulk {
				break
			}
		}
		if len(emails) == 0 {
			return e.JSON(http.StatusBadRequest, map[string]any{"message": "No valid emails"})
		}

		ttl := clampTTL(body.TTLSeconds)
		expiresAt := time.Now().Add(time.Duration(ttl) * time.Second)

		invCol, err := se.App.FindCollectionByNameOrId("room_invites")
		if err != nil {
			return e.JSON(http.StatusInternalServerError, map[string]any{"message": "Invites collection missing"})
		}

		results := make([]map[string]any, 0, len(emails))
		for _, em := range emails {
			inv := core.NewRecord(invCol)
			inv.Set("room", roomId)
			inv.Set("created_by", e.Auth.Id)
			inv.Set("expires_at", expiresAt)
			inv.Set("target_email", em)

			if err := se.App.Save(inv); err != nil {
				// skip failed ones, continue with others
				continue
			}
			results = append(results, map[string]any{
				"email":     em,
				"token":     inv.Id,
				"url":       "/invite/" + inv.Id,
				"expiresAt": expiresAt,
			})
		}

		return e.JSON(http.StatusOK, map[string]any{"invites": results})
	}).Bind(apis.RequireAuth())

	// GET /api/invite/{token}
	se.Router.GET("/api/invite/{token}", func(e *core.RequestEvent) error {
		token := e.Request.PathValue("token")
		if token == "" {
			return e.JSON(http.StatusBadRequest, map[string]any{"valid": false, "reason": "invalid"})
		}

		inv, err := se.App.FindRecordById("room_invites", token)
		if err != nil || inv == nil {
			return e.JSON(http.StatusOK, map[string]any{"valid": false, "reason": "invalid"})
		}

		// check expiry
		exp := inv.GetDateTime("expires_at")
		if !exp.IsZero() && exp.Time().Before(time.Now()) {
			return e.JSON(http.StatusOK, map[string]any{"valid": false, "reason": "expired"})
		}

		// ensure not used (if schema tracks used fields)
		if inv.Get("used_at") != nil && inv.GetDateTime("used_at").Unix() > 0 {
			return e.JSON(http.StatusOK, map[string]any{"valid": false, "reason": "used"})
		}

		// optionally restrict preview for targeted invites to the target holder
		targetEmail := strings.ToLower(inv.GetString("target_email"))
		requiresAuth := targetEmail != ""
		if requiresAuth {
			if e.Auth == nil || e.Auth.Id == "" {
				return e.JSON(http.StatusOK, map[string]any{"valid": true, "requiresAuth": true})
			}
			if strings.ToLower(e.Auth.Email()) != targetEmail {
				return e.JSON(http.StatusOK, map[string]any{"valid": false, "reason": "invalid"})
			}
		}

		// room preview
		room, _ := se.App.FindRecordById("rooms", inv.GetString("room"))
		preview := map[string]any{"id": inv.GetString("room")}
		if room != nil {
			preview["name"] = room.GetString("name")
		}

		return e.JSON(http.StatusOK, map[string]any{
			"valid":     true,
			"room":      preview,
			"expiresAt": exp,
		})
	})

	// POST /api/invite/{token}/accept
	se.Router.POST("/api/invite/{token}/accept", func(e *core.RequestEvent) error {
		if e.Auth == nil || e.Auth.Id == "" {
			return e.JSON(http.StatusUnauthorized, map[string]any{"message": "Unauthorized"})
		}
		token := e.Request.PathValue("token")
		if token == "" {
			return e.JSON(http.StatusBadRequest, map[string]any{"message": "Invalid token"})
		}

		var resp map[string]any
		err := e.App.RunInTransaction(func(txApp core.App) error {
			inv, err := txApp.FindRecordById("room_invites", token)
			if err != nil || inv == nil {
				resp = map[string]any{"message": "Invalid invite"}
				return apis.NewBadRequestError("invalid invite", err)
			}

			// validate expiry & usage
			exp := inv.GetDateTime("expires_at")
			if !exp.IsZero() && exp.Time().Before(time.Now()) {
				resp = map[string]any{"message": "Invite expired"}
				return apis.NewBadRequestError("expired", nil)
			}
			if inv.Get("used_at") != nil && inv.GetDateTime("used_at").Unix() > 0 {
				resp = map[string]any{"message": "Invite already used"}
				return apis.NewBadRequestError("used", nil)
			}

			// targeted check
			targetEmail := strings.ToLower(inv.GetString("target_email"))
			if targetEmail != "" && strings.ToLower(e.Auth.Email()) != targetEmail {
				resp = map[string]any{"message": "Invite not valid for this account"}
				return apis.NewBadRequestError("invalid target", nil)
			}

			// add membership
			roomId := inv.GetString("room")
			room, err := txApp.FindRecordById("rooms", roomId)
			if err != nil || room == nil {
				resp = map[string]any{"message": "Room not found"}
				return apis.NewBadRequestError("room not found", err)
			}

			already := hasString(room.GetStringSlice("user"), e.Auth.Id)
			room.Set("user+", []string{e.Auth.Id})
			if err := txApp.Save(room); err != nil {
				resp = map[string]any{"message": "Failed to join room"}
				return err
			}

			// consume invite (delete for single-use)
			if err := txApp.Delete(inv); err != nil {
				resp = map[string]any{"message": "Failed to consume invite"}
				return err
			}

			resp = map[string]any{"joined": true, "roomId": roomId}
			if already {
				resp["alreadyMember"] = true
			}
			return nil
		})
		if err != nil {
			return e.JSON(http.StatusBadRequest, resp)
		}
		return e.JSON(http.StatusOK, resp)
	}).Bind(apis.RequireAuth())

	// Add cron cleanup for expired unused invites (best-effort)
	se.App.Cron().Add("cleanup_room_invites", "@every 1h", func() {
		// Delete invites where expires_at < now and used_at IS NULL
		// Execute directly with a small safety window
		now := time.Now()
		// try to run in a transaction to avoid partial cleanup errors
		_ = se.App.RunInTransaction(func(txApp core.App) error {
			_, _ = txApp.NonconcurrentDB().
				Delete("room_invites", dbx.NewExp("expires_at < {:now} AND (used_at IS NULL OR used_at = '')", dbx.Params{"now": now})).
				Execute()
			return nil
		})
	})
}

func clampTTL(n int) int {
	// default 48h, max 14d
	if n <= 0 {
		return 48 * 3600
	}
	max := 14 * 24 * 3600
	if n > max {
		return max
	}
	return n
}

func isCreatorOrAdmin(room *core.Record, userId string) bool {
	if room.GetString("creator") == userId {
		return true
	}
	admins := room.GetStringSlice("admins")
	for _, id := range admins {
		if id == userId {
			return true
		}
	}
	return false
}

func hasString(arr []string, v string) bool {
	for _, s := range arr {
		if s == v {
			return true
		}
	}
	return false
}
