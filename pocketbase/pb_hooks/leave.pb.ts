/// <reference path="../pb_data/types.d.ts" />

routerAdd("GET", "/api/room/leave/{id}", (e) => {
	if (!e.request) return e.json(400, { message: "Invalid request" })
	const collectionId = e.request.pathValue("id")
	if (!e.auth) return e.json(401, { message: "Unauthorized" })

	const auth = e.auth
	const deckcollection = $app.findRecordById("deckcollections", collectionId)

	const adminArray = deckcollection.get("admins")

	if (adminArray && adminArray.includes(auth.id)) {
		deckcollection.set("admins-", [auth.id])
		deckcollection.set("user-", [auth.id])
	} else {
		deckcollection.set("user-", [auth.id])
	}


    console.log($app.subscriptionsBroker().totalClients())

	$app.save(deckcollection)

	return e.json(200, { message: `Leave collection ${collectionId}` })
})
