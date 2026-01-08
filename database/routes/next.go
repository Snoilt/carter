package routes

import (
	"time"

	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
)

// Next registers the GET /api/learn/next/{deckid} endpoint.
// Behavior:
//   - Prefer a new card (no existing user_cards for this user+card in the deck).
//     When found, lazily create the user_card (immediately due) and ensure fsrs state exists lazily on review.
//   - Otherwise, return the earliest due user_card in the deck.
//   - If neither exists, return type "none".
func Next(se *core.ServeEvent) {
	se.Router.GET("/api/learn/next/{deckid}", func(e *core.RequestEvent) error {
		deckId := e.Request.PathValue("deckid")
		if deckId == "" {
			return e.JSON(400, "Missing deck id")
		}

		if e.Auth == nil || e.Auth.Id == "" {
			return e.JSON(401, "Authentication required")
		}

		userId := e.Auth.Id
		now := time.Now()
		nowIso := now.UTC().Format(time.RFC3339)

		// Ensure the deck exists and the user has access to it
		deck, err := se.App.FindRecordById("decks", deckId)
		if err != nil || deck == nil {
			return e.JSON(404, "Deck not found")
		}
		reqInfo, _ := e.RequestInfo()
		if ok, _ := se.App.CanAccessRecord(deck, reqInfo, deck.Collection().ListRule); !ok {
			return e.JSON(403, "Forbidden: no access to deck")
		}

		// 1) Try to find a new card first (no user_cards for this user+card)
		// Scan cards in batches to avoid large memory usage.
		batchSize := 200
		offset := 0
		for {
			cards, _ := se.App.FindRecordsByFilter(
				"cards",
				"deck = '"+deckId+"'",
				"created",
				batchSize,
				offset,
			)
			if len(cards) == 0 {
				break
			}

			for _, c := range cards {
				// Does a user_card for this user+card already exist?
				_, err := se.App.FindFirstRecordByFilter(
					"user_cards",
					"user_id = '"+userId+"' && card_id = '"+c.Id+"'",
				)
				if err == nil {
					// exists -> skip
					continue
				}

				// Create user_card lazily (immediately due)
				ucCol, err := se.App.FindCollectionByNameOrId("user_cards")
				if err != nil {
					return e.JSON(500, "Failed to resolve user_cards collection")
				}
				uc := core.NewRecord(ucCol)
				uc.Set("user_id", userId)
				uc.Set("card_id", c.Id)
				uc.Set("deck_id", deckId)
				uc.Set("suspended", false)
				uc.Set("due_at", now)

				// Attempt save; on unique constraint race, fallback to fetch existing
				if err := se.App.Save(uc); err != nil {
					existing, err2 := se.App.FindFirstRecordByFilter(
						"user_cards",
						"user_id = '"+userId+"' && card_id = '"+c.Id+"'",
					)
					if err2 != nil {
						return e.JSON(500, "Failed to create or fetch user card")
					}
					uc = existing
				}

				// Compose response for a new card
				return e.JSON(200, map[string]any{
					"type":   "new",
					"deckId": deckId,
					"now":    nowIso,
					"userCard": map[string]any{
						"id":    uc.Id,
						"dueAt": uc.Get("due_at"),
					},
					"card": map[string]any{
						"id":       c.Id,
						"question": c.GetString("question"),
						"solution": c.GetString("solution"),
						"deck":     c.GetString("deck"),
					},
					// FSRS state is lazily created on review; provide defaults for UI convenience
					"fsrs": map[string]any{
						"stability":      0,
						"difficulty":     0,
						"lapses":         0,
						"state":          "new",
						"lastReviewedAt": nil,
					},
				})
			}

			offset += batchSize
		}

		// 2) No new cards -> find earliest due user_card
		due, _ := se.App.FindRecordsByFilter(
			"user_cards",
			"user_id = '"+userId+"' && deck_id = '"+deckId+"' && (suspended = false || suspended = null) && due_at <= '"+nowIso+"'",
			"due_at,created",
			1,
			0,
		)
		if len(due) > 0 {
			uc := due[0]
			card, err := se.App.FindRecordById("cards", uc.GetString("card_id"))
			if err != nil {
				return e.JSON(500, "Failed to fetch card")
			}
			// Try to fetch fsrs state for this user_card
			fsrsState, _ := se.App.FindFirstRecordByFilter(
				"user_card_fsrs_state",
				"user_card_id = '"+uc.Id+"'",
			)

			var fsrsPayload map[string]any
			if fsrsState != nil {
				fsrsPayload = map[string]any{
					"stability":      fsrsState.GetFloat("stability"),
					"difficulty":     fsrsState.GetFloat("difficulty"),
					"lapses":         fsrsState.GetInt("lapses"),
					"state":          fsrsState.Get("state"),
					"lastReviewedAt": fsrsState.GetDateTime("last_reviewed_at"),
				}
			} else {
				fsrsPayload = map[string]any{
					"stability":      0,
					"difficulty":     0,
					"lapses":         0,
					"state":          "new",
					"lastReviewedAt": nil,
				}
			}

			return e.JSON(200, map[string]any{
				"type":   "due",
				"deckId": deckId,
				"now":    nowIso,
				"userCard": map[string]any{
					"id":    uc.Id,
					"dueAt": uc.GetDateTime("due_at"),
				},
				"card": map[string]any{
					"id":       card.Id,
					"question": card.GetString("question"),
					"solution": card.GetString("solution"),
					"deck":     card.GetString("deck"),
				},
				"fsrs": fsrsPayload,
			})
		}

		// 3) Nothing new or due
		return e.JSON(200, map[string]any{
			"type":    "none",
			"deckId":  deckId,
			"now":     nowIso,
			"message": "No new or due cards available in this deck.",
		})
	}).Bind(apis.RequireAuth())
}
