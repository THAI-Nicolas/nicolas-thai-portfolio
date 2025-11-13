/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_458473246")

  // update field
  collection.fields.addAt(2, new Field({
    "hidden": false,
    "id": "file4273923375",
    "maxSelect": 1,
    "maxSize": 0,
    "mimeTypes": [],
    "name": "logo",
    "presentable": false,
    "protected": false,
    "required": false,
    "system": false,
    "thumbs": [],
    "type": "file"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_458473246")

  // update field
  collection.fields.addAt(2, new Field({
    "hidden": false,
    "id": "file4273923375",
    "maxSelect": 1,
    "maxSize": 0,
    "mimeTypes": [],
    "name": "icone",
    "presentable": false,
    "protected": false,
    "required": false,
    "system": false,
    "thumbs": [],
    "type": "file"
  }))

  return app.save(collection)
})
