import express from "express";
import cards from "./routes/cards.js";

// Expressアプリケーションのインスタンスを作成
const app = express();

// ポート番号設定
const PORT = 3000;

// ルート(ホームページ)にアクセスがあった場合
// app.get("/", (req, res) => {
//   res.send("APIが動いています！");
// });

// ルーティングを適用
app.use("/api", cards);

// サーバーをポート3000で起動
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});