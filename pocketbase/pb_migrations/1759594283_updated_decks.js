/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2843432925")

  // update collection data
  unmarshal({
    "listRule": "@request.auth.id != \"\" && (\n  @request.auth.id = creator.decks_via_creator.creator ||\n  @request.auth.id = admins.decks_via_admins.admins\n  \n)"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2843432925")

  // update collection data
  unmarshal({
    "listRule": "@request.auth.id != \"\" && (\n  @request.auth.id = creator.decks_via_creator.creator\n)"
  }, collection)

  return app.save(collection)
})
