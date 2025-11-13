/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3246824166")

  // update collection data
  unmarshal({
    "name": "processus_etapes"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3246824166")

  // update collection data
  unmarshal({
    "name": "processus_creation"
  }, collection)

  return app.save(collection)
})
