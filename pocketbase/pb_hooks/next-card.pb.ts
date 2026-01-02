// import "../pb_data/types.d.ts"

routerAdd("GET", "/api/card/next/{deck}", (event_) => {
	if (!event_.request) return event_.json(400, { message: "Invalid request" })

	const deckId = event_.request.pathValue("deck")

	//Hier kommt die funktion, die die nächste karte aus dem Deck zurückgibt
})
