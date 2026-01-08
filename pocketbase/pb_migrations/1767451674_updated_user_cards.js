/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_414225205")

  // update collection data
  unmarshal({
    "indexes": [
      "CREATE UNIQUE INDEX `idx_k7v6LUFnvk` ON `user_cards` (\n  `user_id`,\n  `card_id`\n)"
    ]
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_414225205")

  // update collection data
  unmarshal({
    "indexes": []
  }, collection)

  return app.save(collection)
})
