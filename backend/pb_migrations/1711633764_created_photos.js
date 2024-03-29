/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "34r2pmi7v9x3183",
    "created": "2024-03-28 13:49:24.964Z",
    "updated": "2024-03-28 13:49:24.964Z",
    "name": "photos",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "bzbmig5h",
        "name": "title",
        "type": "text",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "9xktxbqh",
        "name": "file",
        "type": "file",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "mimeTypes": [
            "image/jpeg",
            "image/png",
            "image/svg+xml",
            "image/gif",
            "image/webp"
          ],
          "thumbs": [
            "720x480"
          ],
          "maxSelect": 1,
          "maxSize": 7339968,
          "protected": false
        }
      },
      {
        "system": false,
        "id": "ymj0szfp",
        "name": "author",
        "type": "relation",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "collectionId": "_pb_users_auth_",
          "cascadeDelete": true,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": null
        }
      },
      {
        "system": false,
        "id": "er71nulw",
        "name": "categories",
        "type": "text",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      }
    ],
    "indexes": [],
    "listRule": "",
    "viewRule": "",
    "createRule": "author.id = @request.auth.id",
    "updateRule": null,
    "deleteRule": "author.id = @request.auth.id",
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("34r2pmi7v9x3183");

  return dao.deleteCollection(collection);
})
