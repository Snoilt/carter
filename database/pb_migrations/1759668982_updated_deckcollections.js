/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2843432925")

  // update collection data
  unmarshal({
    "listRule": "@request.auth.id ~ user.id",
    "updateRule": "@request.body.user.id !~ user.id && \n@request.auth.id ~ user.id &&\n@request.body.user:length < user:length\n\n\n"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2843432925")

  // update collection data
  unmarshal({
    "listRule": "@request.auth.id ?~ user.id",
    "updateRule": null
  }, collection)

  return app.save(collection)
})
