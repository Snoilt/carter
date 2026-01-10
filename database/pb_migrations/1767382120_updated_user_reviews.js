/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1726329091")

  // add field
  collection.fields.addAt(8, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_414225205",
    "hidden": false,
    "id": "relation314672170",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "user_card_id",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1726329091")

  // remove field
  collection.fields.removeById("relation314672170")

  return app.save(collection)
})
