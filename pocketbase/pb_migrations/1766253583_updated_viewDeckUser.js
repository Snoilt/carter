/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3223685035")

  // update collection data
  unmarshal({
    "viewQuery": "SELECT\n  printf('%s_%s', dc.id, u.id) AS id,\n  dc.id                       AS deckcollection,\n  u.id                        AS userId,\n  u.name                      AS userName,\n  u.avatar                    AS userAvatar\nFROM deckcollections dc\nJOIN json_each(dc.user) je\nJOIN users u\n  ON u.id = je.value;\n"
  }, collection)

  // remove field
  collection.fields.removeById("json344172009")

  // add field
  collection.fields.addAt(2, new Field({
    "cascadeDelete": false,
    "collectionId": "_pb_users_auth_",
    "hidden": false,
    "id": "relation1689669068",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "userId",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  // add field
  collection.fields.addAt(3, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "_clone_DQoE",
    "max": 255,
    "min": 0,
    "name": "userName",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": true,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(4, new Field({
    "hidden": false,
    "id": "_clone_CUhL",
    "maxSelect": 1,
    "maxSize": 0,
    "mimeTypes": [
      "image/jpeg",
      "image/png",
      "image/svg+xml",
      "image/gif",
      "image/webp"
    ],
    "name": "userAvatar",
    "presentable": false,
    "protected": false,
    "required": false,
    "system": false,
    "thumbs": null,
    "type": "file"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3223685035")

  // update collection data
  unmarshal({
    "viewQuery": "SELECT\n  dc.id AS id,\n  dc.id AS deckcollection,\n  json_group_array(\n    json_object(\n      'id', u.id,\n      'name', u.name,\n      'avatar', u.avatar\n    )\n  ) AS users\nFROM deckcollections dc\nJOIN json_each(dc.user) je\nJOIN users u\n  ON u.id = je.value\nGROUP BY dc.id;\n"
  }, collection)

  // add field
  collection.fields.addAt(2, new Field({
    "hidden": false,
    "id": "json344172009",
    "maxSize": 1,
    "name": "users",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "json"
  }))

  // remove field
  collection.fields.removeById("relation1689669068")

  // remove field
  collection.fields.removeById("_clone_DQoE")

  // remove field
  collection.fields.removeById("_clone_CUhL")

  return app.save(collection)
})
