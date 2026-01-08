package routes

import (
	"math"
	"net/http"
	"time"

	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/types"
)

var WEIGHTS = []float64{
	0.4872, 1.4003, 3.7145, 13.8206, 5.1618, 1.2298, 0.8975, 0.031, 1.6474, 0.1367,
	1.0461, 2.1072, 0.0793, 0.3246, 1.587, 0.2272, 2.8755,
}

const (
	DECAY             = -0.5
	FACTOR            = 19.0 / 81.0
	RELEARN_MINUTES   = 10
	REQUEST_RETENTION = 0.9

	StateNew        = "new"
	StateRelearning = "relearning"
	StateReview     = "review"
)

type ReviewRequest struct {
	UserCardId string `json:"userCardId"`
	Rating     int    `json:"rating"`
	AttemptId  string `json:"attemptId"`
}

// FSRSState represents the current FSRS state for a card
type FSRSState struct {
	Stability      float64
	Difficulty     float64
	Lapses         int
	State          string
	LastReviewedAt types.DateTime
}

// FSRSResult represents the calculated new FSRS values after a review
type FSRSResult struct {
	Stability  float64
	Difficulty float64
	Lapses     int
	State      string
	DueAt      types.DateTime
}

// calculateFSRS computes the new FSRS values based on current state and rating
func calculateFSRS(current FSRSState, rating int, now time.Time) FSRSResult {
	isFirst := current.LastReviewedAt.IsZero() ||
		current.State == StateNew ||
		current.Stability <= 0 ||
		current.Difficulty <= 0

	var daysSinceReview float64
	if !current.LastReviewedAt.IsZero() {
		daysSinceReview = now.Sub(current.LastReviewedAt.Time()).Hours() / 24
	}

	currentRetrievability := retrievability(daysSinceReview, current.Stability)

	result := FSRSResult{
		Stability:  current.Stability,
		Difficulty: current.Difficulty,
		Lapses:     current.Lapses,
		State:      current.State,
	}

	if isFirst {
		result.Stability = initialStability(rating)
		result.Difficulty = initialDifficulty(rating)
	} else {
		result.Difficulty = nextDifficulty(current.Difficulty, rating)
		if rating > 1 {
			result.Stability = stabilityAfterRecall(current.Stability, result.Difficulty, currentRetrievability, rating)
		} else {
			result.Stability = stabilityAfterForget(current.Stability, result.Difficulty, currentRetrievability)
		}
	}

	if rating == 1 {
		result.Lapses = current.Lapses + 1
		result.State = StateRelearning
		result.DueAt, _ = types.ParseDateTime(now.Add(time.Duration(RELEARN_MINUTES) * time.Minute))
	} else {
		result.State = StateReview
		result.DueAt, _ = types.ParseDateTime(now.AddDate(0, 0, nextIntervalDays(result.Stability)))
	}

	return result
}

func clamp(value, min, max float64) float64 {
	return math.Max(min, math.Min(max, value))
}

func retrievability(daysSinceReview, stability float64) float64 {
	if stability <= 0 || daysSinceReview <= 0 {
		return 1
	}
	return math.Pow(1+FACTOR*(daysSinceReview/stability), DECAY)
}

func initialStability(rating int) float64 {
	return WEIGHTS[rating-1]
}

func initialDifficulty(rating int) float64 {
	return clamp(WEIGHTS[4]-float64(rating-3)*WEIGHTS[5], 1, 10)
}

func nextDifficulty(currentDifficulty float64, rating int) float64 {
	initialDifficultyWeight := WEIGHTS[4]
	adjustedDifficulty := currentDifficulty - WEIGHTS[6]*float64(rating-3)
	newDifficulty := WEIGHTS[7]*initialDifficultyWeight + (1-WEIGHTS[7])*adjustedDifficulty
	return clamp(newDifficulty, 1, 10)
}

func nextIntervalDays(stability float64) int {
	if stability <= 0 {
		return 1
	}
	interval := (stability / FACTOR) * (math.Pow(REQUEST_RETENTION, 1/DECAY) - 1)
	return int(math.Max(1, math.Round(interval)))
}

func stabilityAfterRecall(stability, difficulty, retrievability float64, rating int) float64 {
	hardMultiplier := 1.0
	easyMultiplier := 1.0
	if rating == 2 {
		hardMultiplier = WEIGHTS[15]
	}
	if rating == 4 {
		easyMultiplier = WEIGHTS[16]
	}

	base := math.Exp(WEIGHTS[8]) *
		(11 - difficulty) *
		math.Pow(stability, -WEIGHTS[9]) *
		(math.Exp(WEIGHTS[10]*(1-retrievability)) - 1) *
		hardMultiplier *
		easyMultiplier

	newStability := stability * (base + 1)
	return math.Max(newStability, stability)
}

func stabilityAfterForget(stability, difficulty, retrievability float64) float64 {
	newStability := WEIGHTS[11] *
		math.Pow(difficulty, -WEIGHTS[12]) *
		(math.Pow(stability+1, WEIGHTS[13]) - 1) *
		math.Exp(WEIGHTS[14]*(1-retrievability))
	return math.Max(0.01, newStability)
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
	newRecord.Set("state", StateNew)

	if err := app.Save(newRecord); err != nil {
		return nil, false, err
	}

	return newRecord, true, nil
}

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

		userCardFSRSState, _, err := fetchOrCreateFSRSState(se.App, userCardId)
		if err != nil {
			return e.JSON(http.StatusInternalServerError, "Couldn't fetch FSRS state")
		}

		currentState := FSRSState{
			Stability:      userCardFSRSState.GetFloat("stability"),
			Difficulty:     userCardFSRSState.GetFloat("difficulty"),
			Lapses:         userCardFSRSState.GetInt("lapses"),
			State:          userCardFSRSState.GetString("state"),
			LastReviewedAt: userCardFSRSState.GetDateTime("last_reviewed_at"),
		}

		now := time.Now()

		result := calculateFSRS(currentState, rating, now)

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
