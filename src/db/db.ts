// import { MongoClient } from "mongodb";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export const connectDB = async() => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log("MongoDB Atlas connected ✅");
  } catch(err) {
    console.error("Error connection to MOngoDB ❌:", err);
    throw new Error("DB接続に失敗しました");
  }
};

export const closeDB = async() => {
  await mongoose.disconnect();
  console.log("MongoDBの接続を切断しました");
};