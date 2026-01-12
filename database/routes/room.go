package routes

import (
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
)

func Room(se *core.ServeEvent) {
	se.Router.GET("/api/room/leave/{id}", func(e *core.RequestEvent) error {
		roomId := e.Request.PathValue("id")
		if roomId == "" {
			return e.JSON(400, map[string]any{"message": "Invalid request"})
		}

		if e.Auth == nil || e.Auth.Id == "" {
			return e.JSON(401, map[string]any{"message": "Unauthorized"})
		}

		room, err := se.App.FindRecordById("rooms", roomId)
		if err != nil || room == nil {
			return e.JSON(404, map[string]any{"message": "Room not found"})
		}

		userId := e.Auth.Id

		room.SetIfFieldExists("admins-", []string{userId})
		room.SetIfFieldExists("user-", []string{userId})

		se.App.Logger().Info(
			"room leave",
			"roomId", roomId,
			"userId", userId,
			"totalClients", se.App.SubscriptionsBroker().TotalClients(),
		)

		if err := se.App.Save(room); err != nil {
			return e.JSON(500, map[string]any{"message": "Failed to update room"})
		}

		// Avoid caches for state-changing GET.
		e.Response.Header().Set("Cache-Control", "no-store")

		return e.JSON(200, map[string]any{
			"message": "left",
			"roomId":  roomId,
			"left":    true,
		})
	}).Bind(apis.RequireAuth())
}
