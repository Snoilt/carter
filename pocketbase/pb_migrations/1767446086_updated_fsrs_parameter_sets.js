/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_957117955")

  // update field
  collection.fields.addAt(3, new Field({
    "hidden": false,
    "id": "json4068546429",
    "maxSize": 0,
    "name": "weights_json",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "json"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_957117955")

  // update field
  collection.fields.addAt(3, new Field({
    "hidden": false,
    "id": "json4068546429",
    "maxSize": 0,
    "name": "weigths_json",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "json"
  }))

  return app.save(collection)
})
