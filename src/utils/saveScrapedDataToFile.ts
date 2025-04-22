import fs from "fs";
import { scrapeData } from "../puppeteer/scrape.js";
import { CardData } from "../types/card.js";

// スクレイピングデータを取得
const getScrapeData = async (): Promise<CardData[]> => {
  const data = await scrapeData();
  return data || [];
}
// ローカルにJSONファイルとして保存
const saveDataToJsonFile = async(data: CardData[]) => {
  fs.writeFileSync("./public/scrapeData.json", JSON.stringify(data, null, 2), "utf-8");
  console.log("JSONファイルが保存されました");
}

// データを保存
const run = async () => {
  const data = await getScrapeData();
  await saveDataToJsonFile(data);
};

run();