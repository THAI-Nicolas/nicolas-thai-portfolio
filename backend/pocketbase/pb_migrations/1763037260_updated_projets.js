/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_621264433")

  // remove field
  collection.fields.removeById("text3807930449")

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_621264433")

  // add field
  collection.fields.addAt(6, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text3807930449",
    "max": 0,
    "min": 0,
    "name": "objectif",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  return app.save(collection)
})
