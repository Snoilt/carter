import "../pb_data/types.d.ts"

onRecordAfterUpdateSuccess((error) => {
	if (error.record?.get("user").length == 0) {
		error.app.delete(error.record)
	}

	console.log($app.subscriptionsBroker().totalClients())
	error.next()
})
