import express from "express";
import { getDataFromMongo } from "../db/getData.js";

const router = express.Router();

// GET /api/cards でデータを取得
router.get("/cards", async (req, res) => {
  try {
    const data = await getDataFromMongo();
    res.json(data);
  } catch (error) {
    res.status(500).json({error: "データの取得に失敗しました。"})
  }
});

export default router;