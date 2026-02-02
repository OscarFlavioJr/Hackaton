import { MongoClient } from "mongodb";

const uri = process.env.mongo_uri;
const client = new MongoClient(uri);

let db;

export async function connectDB() {
  if (!db) {
    await client.connect();
    db = client.db("movie_recommender");
    console.log("MongoDB conectado");
  }
  return db;
}
