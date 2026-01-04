/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1757051097")

  // remove field
  collection.fields.removeById("json2659956072")

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1757051097")

  // add field
  collection.fields.addAt(4, new Field({
    "hidden": false,
    "id": "json2659956072",
    "maxSize": 0,
    "name": "playData",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "json"
  }))

  return app.save(collection)
})
