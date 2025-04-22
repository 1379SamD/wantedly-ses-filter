import fs from "fs";
import { scrapeData } from "../puppeteer/scrape.js";
import { CardData, Carditem } from "../types/card.js";

// スクレイピングデータを取得
const getScrapeData = async (): Promise<Carditem> => {
  const data = await scrapeData();
  const result: Carditem = {
    lastUpdated: new Date().toISOString(),
    data: data ?? []
  };
  return result;
}
// ローカルにJSONファイルとして保存
const saveDataToJsonFile = async(data: Carditem) => {
  fs.writeFileSync("./public/scrapeData.json", JSON.stringify(data, null, 2), "utf-8");
  console.log("JSONファイルが保存されました");
}

// データを保存
const run = async () => {
  const data = await getScrapeData();
  await saveDataToJsonFile(data);
};

run();