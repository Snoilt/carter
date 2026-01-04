/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_776080983")

  // update collection data
  unmarshal({
    "createRule": "user_card_id.user_id = @request.auth.id",
    "deleteRule": "user_card_id.user_id = @request.auth.id",
    "listRule": "user_card_id.user_id = @request.auth.id",
    "updateRule": "user_card_id.user_id = @request.auth.id",
    "viewRule": "user_card_id.user_id = @request.auth.id"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_776080983")

  // update collection data
  unmarshal({
    "createRule": null,
    "deleteRule": null,
    "listRule": null,
    "updateRule": null,
    "viewRule": null
  }, collection)

  return app.save(collection)
})
