/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_414225205")

  // add field
  collection.fields.addAt(5, new Field({
    "hidden": false,
    "id": "bool2325058159",
    "name": "suspended",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_414225205")

  // remove field
  collection.fields.removeById("bool2325058159")

  return app.save(collection)
})
