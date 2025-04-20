import { connectDB } from "./db.js";
import { Card } from "../models/Card.js";

export const getDataFromMongo = async() => {
  try {
    // DB接続するだけでOK
    await connectDB();

    // sesFlag: false のデータを全て取得
    // lean() で軽量なJSオブジェクトに
    const data = await Card.find({ sesFlag: false }).lean(); 
    return data;
  } catch(error) {
    console.error("Error fetching data from MongoDB:", error);
  }
}