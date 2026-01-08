/// <reference path="../pb_data/types.d.ts" />

routerAdd(
	"GET",
	"/api/learn/next/{id}",
	(e) => {
		if (!e.auth) throw new Error("Authentication required.")

		const deckId = e.request.pathValue("id")
		const userId = e.auth.id
		const nowIso = new Date().toISOString()

		// 1) Try to return next due user_card (no "due_at != null" guard!)
		let due = []
		try {
			due = $app.findRecordsByFilter(
				"user_cards",
				"user_id = {:uid} && deck_id = {:deckId} && (suspended = false || suspended = null) && due_at <= {:now}",
				"due_at,created",
				1,
				0,
				{ uid: userId, deckId, now: nowIso },
			)
		} catch (_) {
			due = []
		}

		if (due.length > 0) {
			const uc = due[0]
			const card = $app.findRecordById("cards", uc.getString("card_id"))

			let fsrs = null
			try {
				fsrs = $app.findFirstRecordByFilter(
					"user_card_fsrs_state",
					"user_card_id = {:ucId}",
					{ ucId: uc.id },
				)
			} catch (_) {
				fsrs = null
			}

			return e.json(200, {
				type: "due",
				deckId,
				now: nowIso,
				userCard: { id: uc.id, dueAt: uc.get("due_at") },
				card: {
					id: card.id,
					question: card.get("question"),
					solution: card.get("solution"),
					deck: card.get("deck"),
				},
				fsrs: fsrs
					? {
							stability: fsrs.get("stability") ?? 0,
							difficulty: fsrs.get("difficulty") ?? 0,
							lapses: fsrs.get("lapses") ?? 0,
							state: fsrs.get("state") ?? "new",
							lastReviewedAt: fsrs.get("last_reviewed_at") || null,
						}
					: {
							stability: 0,
							difficulty: 0,
							lapses: 0,
							state: "new",
							lastReviewedAt: null,
						},
			})
		}

		// 2) No due card -> find a card in this deck without an existing user_cards record
		// Scan cards in small batches (NoSQL style).
		const batchSize = 200
		let offset = 0

		while (true) {
			const cards = $app.findRecordsByFilter(
				"cards",
				"deck = {:deckId}",
				"created",
				batchSize,
				offset,
				{ deckId },
			)

			if (cards.length === 0) break

			for (let c of cards) {
				let exists = true
				try {
					$app.findFirstRecordByFilter(
						"user_cards",
						"user_id = {:uid} && card_id = {:cid}",
						{ uid: userId, cid: c.id },
					)
					exists = true
				} catch (_) {
					exists = false
				}

				if (!exists) {
					// 3) Lazy create user_cards + fsrs state (transaction)
					let createdUserCardId = ""

					$app.runInTransaction((txApp) => {
						const ucCol = txApp.findCollectionByNameOrId("user_cards")
						const stCol = txApp.findCollectionByNameOrId("user_card_fsrs_state")

						const uc = new Record(ucCol)
						uc.set("user_id", userId)
						uc.set("card_id", c.id)
						uc.set("deck_id", deckId)
						uc.set("suspended", false)
						uc.set("due_at", nowIso) // immediately due

						try {
							txApp.save(uc)
							createdUserCardId = uc.id
						} catch (_) {
							// Race: record may already exist (unique user_id+card_id):contentReference[oaicite:1]{index=1}
							const existing = txApp.findFirstRecordByFilter(
								"user_cards",
								"user_id = {:uid} && card_id = {:cid}",
								{ uid: userId, cid: c.id },
							)
							createdUserCardId = existing.id
						}

						// Ensure fsrs state exists (unique user_card_id):contentReference[oaicite:2]{index=2}
						let st = null
						try {
							st = txApp.findFirstRecordByFilter(
								"user_card_fsrs_state",
								"user_card_id = {:ucId}",
								{ ucId: createdUserCardId },
							)
						} catch (_) {
							st = null
						}

						if (!st) {
							const s = new Record(stCol)
							s.set("user_card_id", createdUserCardId)
							s.set("stability", 0)
							s.set("difficulty", 0)
							s.set("lapses", 0)
							s.set("state", "new")
							txApp.save(s)
						}
					})

					return e.json(200, {
						type: "new",
						deckId,
						now: nowIso,
						userCard: { id: createdUserCardId, dueAt: nowIso },
						card: {
							id: c.id,
							question: c.get("question"),
							solution: c.get("solution"),
							deck: c.get("deck"),
						},
						fsrs: {
							stability: 0,
							difficulty: 0,
							lapses: 0,
							state: "new",
							lastReviewedAt: null,
						},
					})
				}
			}

			offset += batchSize
		}

		// 4) Nothing due and no unseen cards in deck
		return e.json(200, {
			type: "none",
			deckId,
			now: nowIso,
			message: "No due cards and no new cards available in this deck.",
		})
	},
	$apis.requireAuth(),
)
