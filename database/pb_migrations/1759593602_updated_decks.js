/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2843432925")

  // update collection data
  unmarshal({
    "listRule": "",
    "viewRule": ""
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2843432925")

  // update collection data
  unmarshal({
    "listRule": "@request.auth.id != \"\" && (\n    // User is the owner of the deck\n    @request.body.user.id = @request.auth.id ||\n    // User is admin\n    @request.body.admins.id = @request.auth.id ||\n    // User is creator\n    @request.body.creator.id = @request.auth.id\n)",
    "viewRule": "@request.auth.id != \"\" && (\n    // User is the owner of the deck\n    @request.body.user.id = @request.auth.id ||\n    // User is admin\n    @request.body.admins.id = @request.auth.id ||\n    // User is creator\n    @request.body.creator.id = @request.auth.id\n)"
  }, collection)

  return app.save(collection)
})
