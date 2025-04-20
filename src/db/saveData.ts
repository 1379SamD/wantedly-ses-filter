import { connectDB, closeDB } from "./db.js";
import { Card } from "../models/Card.js";

export const saveToMongo = async(data: object[]) => {
  try {
    await connectDB();

    // 既存データを全て削除
    await Card.deleteMany({});
    console.log("既存データを削除しました");

    // 新しいデータを挿入
    await Card.insertMany(data);
    console.log("データを保存しました");

    await closeDB();

  } catch (err) {
    console.error("MongoDB保存中にエラー:", err);
  }
}