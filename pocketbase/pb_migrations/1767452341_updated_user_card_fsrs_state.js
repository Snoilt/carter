/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_776080983")

  // update collection data
  unmarshal({
    "indexes": [
      "CREATE UNIQUE INDEX `idx_xIB6KURvEi` ON `user_card_fsrs_state` (`user_card_id`)"
    ]
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_776080983")

  // update collection data
  unmarshal({
    "indexes": []
  }, collection)

  return app.save(collection)
})
