/* eslint-disable no-undef */
/* eslint-disable unicorn/consistent-function-scoping */
// import { $app, $apis, Record, routerAdd } from "../pb_utils"

routerAdd(
	"POST",
	"/api/learn/review",
	(event) => {
		if (!event.auth) throw new Error("Authentication required.")

		const userId = event.auth.id
		const now = new Date().toISOString()

		const body = event.requestInfo().body || {}
		const userCardId = body.userCardId
		const rating = Number.parseInt(body.rating, 10)
		const attemptId = body.attemptId

		if (!userCardId) throw new Error("Missing userCardId.")
		if (!attemptId) throw new Error("Missing attemptId.")
		if (!(rating >= 1 && rating <= 4)) throw new Error("rating must be 1..4.")

		// ---- FSRS 4.5 default parameters (17) ----
		const W = [
			0.4872, 1.4003, 3.7145, 13.8206, 5.1618, 1.2298, 0.8975, 0.031, 1.6474, 0.1367,
			1.0461, 2.1072, 0.0793, 0.3246, 1.587, 0.2272, 2.8755,
		]

		// FSRS 4.5 forgetting curve parameters
		const DECAY = -0.5
		const FACTOR = 19 / 81

		const RELEARN_MINUTES = 10
		const REQUEST_RETENTION = 0.9

		function clamp(x, lo, hi) {
			return x < lo ? lo : Math.min(x, hi)
		}

		function addMinutesISO(iso, minutes) {
			const d = new Date(iso)
			d.setTime(d.getTime() + minutes * 60 * 1000)
			return d.toISOString()
		}

		function addDaysISO(iso, days) {
			const d = new Date(iso)
			d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000)
			return d.toISOString()
		}

		function diffDays(fromIso, toIso) {
			const a = new Date(fromIso).getTime()
			const b = new Date(toIso).getTime()
			const ms = b - a
			return ms <= 0 ? 0 : ms / (24 * 60 * 60 * 1000)
		}

		function initialStability(G) {
			return W[G - 1]
		}

		function initialDifficulty(G) {
			return clamp(W[4] - (G - 3) * W[5], 1, 10)
		}

		function nextDifficulty(D, G) {
			const D03 = W[4]
			const temporary = D - W[6] * (G - 3)
			const d = W[7] * D03 + (1 - W[7]) * temporary
			return clamp(d, 1, 10)
		}

		function retrievability(tDays, S) {
			if (!S || S <= 0) return 1
			if (!tDays || tDays <= 0) return 1
			return Math.pow(1 + FACTOR * (tDays / S), DECAY)
		}

		function nextIntervalDays(S) {
			if (!S || S <= 0) return 1
			const t = (S / FACTOR) * (Math.pow(REQUEST_RETENTION, 1 / DECAY) - 1)
			return Math.max(1, Math.round(t))
		}

		function stabilityAfterRecall(S, Dprime, R, G) {
			const hardMul = G === 2 ? W[15] : 1
			const easyMul = G === 4 ? W[16] : 1

			const base =
				Math.exp(W[8]) *
				(11 - Dprime) *
				Math.pow(S, -W[9]) *
				(Math.exp(W[10] * (1 - R)) - 1) *
				hardMul *
				easyMul

			const sNew = S * (base + 1)
			return Math.max(sNew, S)
		}

		function stabilityAfterForget(S, Dprime, R) {
			const s =
				W[11] *
				Math.pow(Dprime, -W[12]) *
				(Math.pow(S + 1, W[13]) - 1) *
				Math.exp(W[14] * (1 - R))
			return Math.max(0.01, s)
		}

		// ---- idempotency fast-path (outside tx) ----
		// try {
		// 	const existing = $app.findFirstRecordByFilter(
		// 		"user_reviews",
		// 		"attempt_id = {:aid}",
		// 		{ aid: attemptId },
		// 	)
		// 	return event.json(200, {
		// 		idempotent: true,
		// 		reviewLogId: existing.id,
		// 	})
		// } catch {
		// 	console.log("no existing review found")
		// 	// not found -> continue
		// }

		let out = {}

		$app.runInTransaction((txApp) => {
			// Re-check idempotency inside tx (race safe)
			// try {
			// 	const existing = txApp.findFirstRecordByFilter(
			// 		"user_reviews",
			// 		"attempt_id = {:aid}",
			// 		{ aid: attemptId },
			// 	)
			// 	out = { idempotent: true, reviewLogId: existing.id }
			// 	return
			// } catch {
			// 	// not found -> continue
			// }

			const userCard = txApp.findRecordById("user_cards", userCardId)

			// Ownership check (server bypasses rules)
			if (userCard.getString("user_id") !== userId) {
				throw new Error("You don't have access to this usercardId.")
			}

			const previousDueAt = userCard.get("due_at")

			// Load or create fsrs state
			let st = {}
			try {
				st = txApp.findFirstRecordByFilter(
					"user_card_fsrs_state",
					"user_card_id = {:ucId}",
					{ ucId: userCardId },
				)
			} catch {
				const stCol = txApp.findCollectionByNameOrId("user_card_fsrs_state")
				st = new Record(stCol)
				st.set("user_card_id", userCardId)
				st.set("stability", 0)
				st.set("difficulty", 0)
				st.set("lapses", 0)
				st.set("state", "new")
				txApp.save(st)
			}

			const previousS = Number.parseFloat(st.get("stability") || 0)
			const previousD = Number.parseFloat(st.get("difficulty") || 0)
			const previousL = Number.parseInt(st.get("lapses") || 0, 10)
			const previousState = (st.get("state") || "new") + ""
			const previousLast = st.get("last_reviewed_at")

			const tDays = previousLast ? diffDays(previousLast, now) : 0
			const R = retrievability(tDays, previousS)

			const isFirst =
				!previousLast || previousState === "new" || previousS <= 0 || previousD <= 0

			let newS = previousS
			let newD = previousD
			let newL = previousL
			let newState = previousState
			let newDueAt = previousDueAt

			if (isFirst) {
				newS = initialStability(rating)
				newD = initialDifficulty(rating)

				if (rating === 1) {
					newL = previousL + 1
					newState = "relearning"
					newDueAt = addMinutesISO(now, RELEARN_MINUTES)
				} else {
					newState = "review"
					newDueAt = addDaysISO(now, nextIntervalDays(newS))
				}
			} else {
				newD = nextDifficulty(previousD, rating)

				if (rating === 1) {
					newL = previousL + 1
					newS = stabilityAfterForget(previousS, newD, R)
					newState = "relearning"
					newDueAt = addMinutesISO(now, RELEARN_MINUTES)
				} else {
					newS = stabilityAfterRecall(previousS, newD, R, rating)
					newState = "review"
					newDueAt = addDaysISO(now, nextIntervalDays(newS))
				}
			}

			// Persist fsrs state
			st.set("stability", newS)
			st.set("difficulty", newD)
			st.set("lapses", newL)
			st.set("state", newState)
			st.set("last_reviewed_at", now)
			txApp.save(st)

			// Persist user_cards due_at
			userCard.set("due_at", newDueAt)
			txApp.save(userCard)

			// Create review log (attempt_id unique)
			const rvCol = txApp.findCollectionByNameOrId("user_reviews")
			const rv = new Record(rvCol)

			rv.set("user_card_id", userCardId)
			rv.set("rating", rating)
			rv.set("attempt_id", attemptId)
			rv.set("reviewed_at", now)

			rv.set("previous_due_at", previousDueAt)
			rv.set("new_due_at", newDueAt)
			rv.set("previous_stability", previousS)
			rv.set("new_stability", newS)
			rv.set("previous_difficulty", previousD)
			rv.set("new_difficulty", newD)

			txApp.save(rv)

			out = {
				idempotent: false,
				reviewLogId: rv.id,
				userCardId,
				rating,
				attemptId,
				next: {
					dueAt: newDueAt,
					stability: newS,
					difficulty: newD,
					lapses: newL,
					state: newState,
					lastReviewedAt: now,
				},
			}
		})

		if (!out) {
			throw new Error("Review transaction finished without a result.")
		}

		return event.json(200, out)
	},
	$apis.requireAuth(),
)
