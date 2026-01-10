/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3223685035")

  // update collection data
  unmarshal({
    "listRule": "@request.auth.id ?~ rooms.user.id\n",
    "viewQuery": "SELECT\n  printf('%s_%s', r.id, u.id) AS id,\n  r.id                       AS rooms,\n  u.id                        AS userId,\n  u.name                      AS userName,\n  u.avatar                    AS userAvatar\nFROM rooms r\nJOIN json_each(r.user) je\nJOIN users u\n  ON u.id = je.value;\n"
  }, collection)

  // remove field
  collection.fields.removeById("relation1692971640")

  // remove field
  collection.fields.removeById("_clone_DQoE")

  // remove field
  collection.fields.removeById("_clone_CUhL")

  // add field
  collection.fields.addAt(1, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_2843432925",
    "hidden": false,
    "id": "relation2090932886",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "rooms",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  // add field
  collection.fields.addAt(3, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "_clone_QvP1",
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
    "id": "_clone_FNwg",
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
    "listRule": "@request.auth.id ?~ deckcollection.user.id\n",
    "viewQuery": "SELECT\n  printf('%s_%s', dc.id, u.id) AS id,\n  dc.id                       AS deckcollection,\n  u.id                        AS userId,\n  u.name                      AS userName,\n  u.avatar                    AS userAvatar\nFROM deckcollections dc\nJOIN json_each(dc.user) je\nJOIN users u\n  ON u.id = je.value;\n"
  }, collection)

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

  // remove field
  collection.fields.removeById("relation2090932886")

  // remove field
  collection.fields.removeById("_clone_QvP1")

  // remove field
  collection.fields.removeById("_clone_FNwg")

  return app.save(collection)
})
