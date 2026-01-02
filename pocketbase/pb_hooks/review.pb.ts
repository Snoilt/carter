// import "../pb_data/types.d.ts"

//Hier kommt der endpunkt zum Karten reviewen

//gpt request Body:
// {
//   "userCardId": "recd9xk3a7m2fqp",
//   "rating": 3,
//   }
// }

//Response sollte so aussehen:
// {
//   "userCardId": "recd9xk3a7m2fqp",
//   "rating": 3,
//   "newDueAt": "2026-01-10T07:00:00Z",
//   "stability": 12.41,
//   "difficulty": 5.62,
//   "state": "review",
//   "lapses": 1,
//   "serverTime": "2026-01-02T14:23:12Z"
// }

routerAdd("POST", "/api/card/review", (event_) => {
	console.log("Review API called")
	if (!event_.request) return event_.json(400, { message: "Invalid request" })

	// retrieve the entire raw body as string
	console.log(toString(event_.request.body))

	// read the body fields via the parsed request object
	const body = event_.requestInfo().body
	console.log(body.title)

	// OR read/scan the request body fields into a typed object
	const data = new DynamicModel({
		// describe the fields to read (used also as initial values)
		userCardId: "",
		rating: 0,
		reviewedAt: new Date(),
	})
	event_.bindBody(data)
	console.log(data.userCardId)
	return event_.json(200, { message: `Reviewed` })
})
