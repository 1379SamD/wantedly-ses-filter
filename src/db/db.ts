import { MongoClient } from "mongodb";

// MongoDB接続用のURL
const url = 'mongodb://localhost:27017';
const dbName = 'wantedly_ses_filter';
const client = new MongoClient(url);

export async function connectDB() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    const db = client.db(dbName);
    return db;
  } catch(err) {
    console.error("Error connection to MOngoDB:", err);
    throw new Error("DB接続に失敗しました");
  }
};

export async function closeDB() {
  await client.close();
  console.log("MongoDBの接続を切断しました");
};