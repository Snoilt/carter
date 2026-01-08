package fsrs

import (
	"math"
	"time"

	"github.com/pocketbase/pocketbase/tools/types"
)

// Parameter weights and constants trained for FSRS-like scheduling
var weights = []float64{
	0.4872, 1.4003, 3.7145, 13.8206, 5.1618, 1.2298, 0.8975, 0.031, 1.6474, 0.1367,
	1.0461, 2.1072, 0.0793, 0.3246, 1.587, 0.2272, 2.8755,
}

const (
	decay            = -0.5
	factor           = 19.0 / 81.0
	relearnMinutes   = 10
	requestRetention = 0.9

	StateNew        = "new"
	StateRelearning = "relearning"
	StateReview     = "review"
)

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

// Calculate computes the new FSRS values based on current state and rating
func Calculate(current FSRSState, rating int, now time.Time) FSRSResult {
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
		result.DueAt, _ = types.ParseDateTime(now.Add(time.Duration(relearnMinutes) * time.Minute))
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
	return math.Pow(1+factor*(daysSinceReview/stability), decay)
}

func initialStability(rating int) float64 {
	return weights[rating-1]
}

func initialDifficulty(rating int) float64 {
	return clamp(weights[4]-float64(rating-3)*weights[5], 1, 10)
}

func nextDifficulty(currentDifficulty float64, rating int) float64 {
	initialDifficultyWeight := weights[4]
	adjustedDifficulty := currentDifficulty - weights[6]*float64(rating-3)
	newDifficulty := weights[7]*initialDifficultyWeight + (1-weights[7])*adjustedDifficulty
	return clamp(newDifficulty, 1, 10)
}

func nextIntervalDays(stability float64) int {
	if stability <= 0 {
		return 1
	}
	interval := (stability / factor) * (math.Pow(requestRetention, 1/decay) - 1)
	return int(math.Max(1, math.Round(interval)))
}

func stabilityAfterRecall(stability, difficulty, retrievability float64, rating int) float64 {
	hardMultiplier := 1.0
	easyMultiplier := 1.0
	if rating == 2 {
		hardMultiplier = weights[15]
	}
	if rating == 4 {
		easyMultiplier = weights[16]
	}

	base := math.Exp(weights[8]) *
		(11 - difficulty) *
		math.Pow(stability, -weights[9]) *
		(math.Exp(weights[10]*(1-retrievability)) - 1) *
		hardMultiplier *
		easyMultiplier

	newStability := stability * (base + 1)
	return math.Max(newStability, stability)
}

func stabilityAfterForget(stability, difficulty, retrievability float64) float64 {
	newStability := weights[11] *
		math.Pow(difficulty, -weights[12]) *
		(math.Pow(stability+1, weights[13]) - 1) *
		math.Exp(weights[14]*(1-retrievability))
	return math.Max(0.01, newStability)
}
