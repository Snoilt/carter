import "../pb_data/types.d.ts"

routerAdd("GET", "/api/room/leave/{id}", (event_) => {
	if (!event_.request) return event_.json(400, { message: "Invalid request" })
	const collectionId = event_.request.pathValue("id")
	if (!event_.auth) return event_.json(401, { message: "Unauthorized" })

	const auth = event_.auth
	const deckcollection = $app.findRecordById("rooms", collectionId)

	const adminArray = deckcollection.get("admins")

	if (adminArray && adminArray.includes(auth.id)) {
		deckcollection.set("admins-", [auth.id])
		deckcollection.set("user-", [auth.id])
	} else {
		deckcollection.set("user-", [auth.id])
	}

	console.log($app.subscriptionsBroker().totalClients())

	$app.save(deckcollection)

	return event_.json(200, { message: `Leave collection ${collectionId}` })
})
