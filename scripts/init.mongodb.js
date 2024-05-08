const database = "test";
const collection = "goals";
use(database);

db.createCollection(collection);
db.getCollection(collection).insertMany([
    {
        text: "test1",
    },
    {
        text: "test2",
    },
    {
        text: "test3",
    },
]);
