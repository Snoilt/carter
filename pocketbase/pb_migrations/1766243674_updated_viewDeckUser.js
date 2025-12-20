/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3223685035")

  // update collection data
  unmarshal({
    "listRule": "@request.auth.id ?~ deckcollection.user.id\n"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3223685035")

  // update collection data
  unmarshal({
    "listRule": "@request.auth.id ?~ deckcollection.user\n"
  }, collection)

  return app.save(collection)
})
