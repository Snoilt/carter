/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3223685035")

  // update collection data
  unmarshal({
    "viewQuery": "SELECT\n  dc.id AS id,\n  dc.id AS deckcollection,\n  json_group_array(\n    json_object(\n      'id', u.id,\n      'name', u.name,\n      'avatar', u.avatar\n    )\n  ) AS users\nFROM deckcollections dc\nJOIN json_each(dc.user) je\nJOIN users u\n  ON u.id = je.value\nGROUP BY dc.id;\n"
  }, collection)

  // remove field
  collection.fields.removeById("relation3895723588")

  // add field
  collection.fields.addAt(1, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_2843432925",
    "hidden": false,
    "id": "relation1692971640",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "deckcollection",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3223685035")

  // update collection data
  unmarshal({
    "viewQuery": "SELECT\n  dc.id AS id,\n  dc.id AS deckcollectionId,\n  json_group_array(\n    json_object(\n      'id', u.id,\n      'name', u.name,\n      'avatar', u.avatar\n    )\n  ) AS users\nFROM deckcollections dc\nJOIN json_each(dc.user) je\nJOIN users u\n  ON u.id = je.value\nGROUP BY dc.id;\n"
  }, collection)

  // add field
  collection.fields.addAt(1, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_2843432925",
    "hidden": false,
    "id": "relation3895723588",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "deckcollectionId",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  // remove field
  collection.fields.removeById("relation1692971640")

  return app.save(collection)
})
