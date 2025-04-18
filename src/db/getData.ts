import { connectDB } from "./db.js";

export async function getDataFromMongo() {
  try {
    const db = await connectDB();
    const collection = db.collection("cards");

    // データを全て取得
    const data = await collection.find({ sesFlag: false }).toArray();
    return data;
  } catch(error) {
    console.error("Error fetching data from MongoDB:", error);
  }
};