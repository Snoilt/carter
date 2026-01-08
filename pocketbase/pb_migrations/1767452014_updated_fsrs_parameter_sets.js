/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_957117955")

  // add field
  collection.fields.addAt(5, new Field({
    "hidden": false,
    "id": "number3826451599",
    "max": null,
    "min": null,
    "name": "max_tage",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_957117955")

  // remove field
  collection.fields.removeById("number3826451599")

  return app.save(collection)
})
