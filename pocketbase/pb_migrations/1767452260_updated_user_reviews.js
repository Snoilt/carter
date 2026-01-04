/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1726329091")

  // update collection data
  unmarshal({
    "indexes": [
      "CREATE UNIQUE INDEX `idx_juTTqYuldZ` ON `user_reviews` (`attempt_id`)"
    ]
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1726329091")

  // update collection data
  unmarshal({
    "indexes": []
  }, collection)

  return app.save(collection)
})
