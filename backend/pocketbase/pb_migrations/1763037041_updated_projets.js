/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_621264433")

  // remove field
  collection.fields.removeById("url2238859452")

  // add field
  collection.fields.addAt(21, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text2238859452",
    "max": 0,
    "min": 0,
    "name": "resultat_iframe",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_621264433")

  // add field
  collection.fields.addAt(18, new Field({
    "exceptDomains": null,
    "hidden": false,
    "id": "url2238859452",
    "name": "resultat_iframe",
    "onlyDomains": null,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "url"
  }))

  // remove field
  collection.fields.removeById("text2238859452")

  return app.save(collection)
})
