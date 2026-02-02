const { MongoClient } = require("mongodb");

const uri = process.env.mongo_uri;
const client = new MongoClient(uri);

let db;

async function connectDB() {
  if (!db) {
    await client.connect();
    db = client.db("movie_recommender");
    console.log("MongoDB conectado");
  }
  return db;
}

module.exports = { connectDB };
