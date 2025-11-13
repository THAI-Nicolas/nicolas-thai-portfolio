/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3246824166")

  // remove field
  collection.fields.removeById("text2862495610")

  // update field
  collection.fields.addAt(2, new Field({
    "hidden": false,
    "id": "number1937347273",
    "max": null,
    "min": null,
    "name": "numero",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3246824166")

  // add field
  collection.fields.addAt(6, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text2862495610",
    "max": 0,
    "min": 0,
    "name": "date",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // update field
  collection.fields.addAt(2, new Field({
    "hidden": false,
    "id": "number1937347273",
    "max": null,
    "min": null,
    "name": "ordre",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
})
