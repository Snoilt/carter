/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2843432925")

  // update collection data
  unmarshal({
    "listRule": "@request.auth.id = user.id"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2843432925")

  // update collection data
  unmarshal({
    "listRule": "@request.auth.id = user"
  }, collection)

  return app.save(collection)
})
