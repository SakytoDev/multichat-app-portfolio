const { MongoClient } = require("mongodb");

const URI = "mongodb://Sakyto:22dns228KLOWNS@localhost:27017/chat";
const client = new MongoClient(URI)

let database

module.exports = {
    setup: async () => {
        await client.connect()
        .then(() => {
            database = client.db()
            console.log("MongoDB подключен")
        })
        .catch()
    },
    getClient: () => client,
    getDatabase: () => database
}