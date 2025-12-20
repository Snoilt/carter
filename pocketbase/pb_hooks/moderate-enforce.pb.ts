import "../pb_data/types.d.ts"

onRecordAfterUpdateSuccess((event_) => {
	event_.next()
	if (!event_.record) return
	const deckCollection = event_.record

	const adminArray = deckCollection?.get("admins")
	const creator = deckCollection?.get("creator")
	const userArray = deckCollection?.get("user")

	if (userArray.length > 0 && adminArray.length === 0 && !userArray.includes(creator)) {
		console.log(userArray[0])
		deckCollection?.set("admins+", [userArray[0]])
		event_.app.save(deckCollection)

		console.log(
			`Tried to set ${userArray[0]} as an admin on collection: ${deckCollection?.id}`,
		)
	}
}, "deckcollections")
