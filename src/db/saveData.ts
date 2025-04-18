import { connectDB, closeDB } from "./db.js";

export async function saveToMongo(data: any) {
  try {
    const db = await connectDB();
    const collection = db.collection("cards");

    // 既存データを全て削除
    await collection.deleteMany({});
    console.log("既存データを削除しました");

    await collection.insertMany(data);
    console.log("データを保存しました");

  } catch (err) {
    console.error("MongoDB保存中にエラー:", err);
  }
}