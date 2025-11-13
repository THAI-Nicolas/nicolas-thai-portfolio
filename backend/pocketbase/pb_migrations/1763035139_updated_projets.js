/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_621264433")

  // remove field
  collection.fields.removeById("url2560465762")

  // add field
  collection.fields.addAt(1, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text2560465762",
    "max": 0,
    "min": 0,
    "name": "slug",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(20, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_458473246",
    "hidden": false,
    "id": "relation1288436504",
    "maxSelect": 999,
    "minSelect": 0,
    "name": "technologies",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  // add field
  collection.fields.addAt(21, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_3246824166",
    "hidden": false,
    "id": "relation4008348701",
    "maxSelect": 999,
    "minSelect": 0,
    "name": "processus",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_621264433")

  // add field
  collection.fields.addAt(1, new Field({
    "exceptDomains": null,
    "hidden": false,
    "id": "url2560465762",
    "name": "slug",
    "onlyDomains": null,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "url"
  }))

  // remove field
  collection.fields.removeById("text2560465762")

  // remove field
  collection.fields.removeById("relation1288436504")

  // remove field
  collection.fields.removeById("relation4008348701")

  return app.save(collection)
})
