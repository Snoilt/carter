package routes

import (
	"net/http"
	"time"

	"database/internal/fsrs"

	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
)

type ReviewRequest struct {
	UserCardId string `json:"userCardId"`
	Rating     int    `json:"rating"`
	AttemptId  string `json:"attemptId"`
}

func fetchOrCreateFSRSState(app core.App, userCardId string) (*core.Record, bool, error) {
	userCardFSRSState, err := app.FindFirstRecordByData("user_card_fsrs_state", "user_card_id", userCardId)
	if err == nil && userCardFSRSState != nil {
		return userCardFSRSState, false, nil
	}

	fsrsStateCollection, err := app.FindCollectionByNameOrId("user_card_fsrs_state")
	if err != nil {
		return nil, false, err
	}

	newRecord := core.NewRecord(fsrsStateCollection)
	newRecord.Set("user_card_id", userCardId)
	newRecord.Set("stability", 0)
	newRecord.Set("difficulty", 0)
	newRecord.Set("lapses", 0)
	newRecord.Set("state", fsrs.StateNew)

	if err := app.Save(newRecord); err != nil {
		return nil, false, err
	}

	return newRecord, true, nil
}

// transactional variant omitted for compatibility with current PocketBase version

func Review(se *core.ServeEvent) {

	se.Router.POST("/api/learn/review", func(e *core.RequestEvent) error {

		reviewData := ReviewRequest{}
		if err := e.BindBody(&reviewData); err != nil {
			return e.JSON(http.StatusInternalServerError, "Failed to parse request body")
		}
		userCardId := reviewData.UserCardId
		attemptId := reviewData.AttemptId
		rating := reviewData.Rating

		reviewExisting, err := se.App.FindFirstRecordByData("user_reviews", "attempt_id", attemptId)
		if err == nil && reviewExisting != nil {
			return e.JSON(http.StatusBadRequest, "This attemptId has already been used for a review.")
		}

		userCard, err := se.App.FindRecordById("user_cards", userCardId)
		if err != nil {
			return e.JSON(http.StatusBadRequest, "Invalid userCardId")
		}

		if userCard.Get("user_id") != e.Auth.Id {
			return e.JSON(http.StatusForbidden, "You don't have access to this usercardId.")
		}

		// Perform FSRS update + review log + due date update (best-effort without transaction)
		now := time.Now()

		userCardFSRSState, _, err := fetchOrCreateFSRSState(se.App, userCardId)
		if err != nil {
			return e.JSON(http.StatusInternalServerError, "Couldn't fetch FSRS state")
		}

		currentState := fsrs.FSRSState{
			Stability:      userCardFSRSState.GetFloat("stability"),
			Difficulty:     userCardFSRSState.GetFloat("difficulty"),
			Lapses:         userCardFSRSState.GetInt("lapses"),
			State:          userCardFSRSState.GetString("state"),
			LastReviewedAt: userCardFSRSState.GetDateTime("last_reviewed_at"),
		}

		result := fsrs.Calculate(currentState, rating, now)

		// Persist FSRS state
		userCardFSRSState.Set("stability", result.Stability)
		userCardFSRSState.Set("difficulty", result.Difficulty)
		userCardFSRSState.Set("lapses", result.Lapses)
		userCardFSRSState.Set("state", result.State)
		userCardFSRSState.Set("last_reviewed_at", now)
		if err := se.App.Save(userCardFSRSState); err != nil {
			return e.JSON(http.StatusInternalServerError, "Could not save FSRS state")
		}

		// Create review log
		reviewCollection, err := se.App.FindCollectionByNameOrId("user_reviews")
		if err != nil {
			return e.JSON(http.StatusInternalServerError, "Failed to find review collection")
		}
		newReviewRecord := core.NewRecord(reviewCollection)
		newReviewRecord.Set("user_card_id", userCardId)
		newReviewRecord.Set("rating", rating)
		newReviewRecord.Set("attempt_id", attemptId)
		newReviewRecord.Set("reviewed_at", now)
		newReviewRecord.Set("previous_due_at", userCard.GetDateTime("due_at"))
		newReviewRecord.Set("new_due_at", result.DueAt)
		newReviewRecord.Set("previous_stability", currentState.Stability)
		newReviewRecord.Set("new_stability", result.Stability)
		newReviewRecord.Set("previous_difficulty", currentState.Difficulty)
		newReviewRecord.Set("new_difficulty", result.Difficulty)
		if err := se.App.Save(newReviewRecord); err != nil {
			return e.JSON(http.StatusInternalServerError, "Could not save review record")
		}

		// Update user card due date
		userCard.Set("due_at", result.DueAt)
		if err := se.App.Save(userCard); err != nil {
			return e.JSON(http.StatusInternalServerError, "Could not save user card")
		}

		return e.JSON(http.StatusOK, map[string]any{
			"userCardId":     userCardId,
			"attemptId":      attemptId,
			"rating":         rating,
			"dueAt":          result.DueAt,
			"stability":      result.Stability,
			"difficulty":     result.Difficulty,
			"lapses":         result.Lapses,
			"state":          result.State,
			"lastReviewedAt": now,
		})
	}).Bind(apis.RequireAuth())
}
