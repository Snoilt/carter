/// <reference path="../pb_data/types.d.ts" />

onRecordAfterUpdateSuccess((e) => {
	if (e.record?.get("user").length == 0) {
		e.app.delete(e.record)
	}

    console.log($app.subscriptionsBroker().totalClients())
    e.next()
})
