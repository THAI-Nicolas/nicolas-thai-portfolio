/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_621264433")

  // update field
  collection.fields.addAt(6, new Field({
    "hidden": false,
    "id": "select1288436504",
    "maxSelect": 2,
    "name": "technologies",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "Astro JS",
      "Alpine JS",
      "HTML",
      "CSS",
      "Javascript",
      "Typescript",
      "Tailwind CSS",
      "Visual Studio Code",
      "Cursor IA",
      "GitHub",
      "Figma"
    ]
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_621264433")

  // update field
  collection.fields.addAt(6, new Field({
    "hidden": false,
    "id": "select1288436504",
    "maxSelect": 2,
    "name": "technologies",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "Astro JS",
      "Alpine JS",
      "HTML",
      "CSS",
      "Javascript",
      "Typescript",
      "Tailwind CSS",
      "Visual Studio Code",
      "Cursor IA",
      "GitHub"
    ]
  }))

  return app.save(collection)
})
