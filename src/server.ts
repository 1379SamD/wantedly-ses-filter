import express from "express";
import cors from "cors";
import cards from "./routes/cards.js";

// Expressアプリケーションのインスタンスを作成
const app = express();

// CORSを許可する
app.use(cors());

// ポート番号設定
const PORT = 3000;

// ルーティングを適用
app.use("/api", cards);

// サーバーをポート3000で起動
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});