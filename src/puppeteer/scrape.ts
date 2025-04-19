import puppeteer from "puppeteer";
import { saveToMongo } from "../db/saveData.js";
import { closeDB } from "../db/db.js"

const scrapeData = async () => {

  // 型定義
  type CardData = {
    title: string;
    companyName: string;
    topImagePic: string;
    wantedlyUrl: string;
    sesFlag: boolean;
  };

  // 全カード情報格納
  const allCardData: CardData[] = [];
  // ses企業ワードを配列に格納
  const sesKeywords = ["客先常駐", "常駐", "派遣", "開発支援", "SES"];
  // NOTses企業ワードを配列に格納
  const notSesKeywords = ["客先常駐なし", "常駐なし", "派遣なし", "SESなし"];
  
  for(let pageNum = 1; pageNum <=5; pageNum++) {

    // puppeteerでブラウザを立ち上げる
    const browser = await puppeteer.launch({headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox', '--dns-prefetch-disable'],});
    const page = await browser.newPage();
  
    // ユーザーエージェント設定
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ' +
      'AppleWebKit/537.36 (KHTML, like Gecko) ' +
      'Chrome/122.0.0.0 Safari/537.36'
    );
  
    // ビューポート設定
    await page.setViewport({
      width: 1280,
      height: 800,
    });

    // スクレイピングしたいURLにアクセス
    const url = `https://www.wantedly.com/projects?new=true&page=${pageNum}&occupationTypes=jp__engineering&jp__engineering=jp__web_engineer&hiringTypes=mid_career&order=recent`;
    await page.goto(url, {waitUntil: "domcontentloaded"});

    // 取得したい要素が表示されるまで待機
    // await page.waitForSelector("li[class*='ProjectListJobPostsLaptop__ProjectListItem']", {visible: true});
    
    // 一秒間待機
    // await new Promise(resolve => setTimeout(resolve, 5000));

    // 必要なデータを抽出
    const pageData = await page.evaluate(() => {
      // １ページの企業情報のliタグを取得
      const items = document.querySelectorAll("li[class*='ProjectListJobPostsLaptop__ProjectListItem']");
      // liタグ情報を回して、1ページ全ての情報を取得
      return Array.from(items).map(item => {
          // liタグがnullであれば、nullを返す ⇒ 最後にnull以外を格納
          if(!item.textContent) {
            return null;
          }
          const title = item.querySelector("h2[class*='ProjectListJobPostItem__TitleText']")?.textContent || "No title found";
          const companyName = item.querySelector("#company-name")?.textContent || "No company-name found";
          const topImagePic = item.querySelector("section img")?.getAttribute("src") || "No image found";
          const wantedlyUrl = "https://www.wantedly.com" + (item.querySelector("section a")?.getAttribute("href")?.trim() || "");
  
          // 取得したデータをオブジェクトにまとめて返す
          return {
            title,
            companyName,
            topImagePic,
            wantedlyUrl,
          };
          // 最後にnull以外を取得
        }).filter(item => item !== null);
    });
    
    // ses企業判定処理
    const isSes = (text: string): boolean => {
      // 否定ワードが含まれていたらfalse(SESではない)
      if(notSesKeywords.some(keyword => text.includes(keyword))) {
        return false;
      }
      return sesKeywords.some(keyword => text.includes(keyword));
    };
  
    // 各カードの詳細ページに飛んでSES判定情報を取得
    for(const card of pageData) {
      const detailPage = await browser.newPage();
      // SES判定(詳細ページ内での処理)
      const description = await detailPage.evaluate(() => {
        // SES判定に使う要素をすべて取得
        const descriptionItems = document.querySelectorAll("div[class*=ProjectPlainDescription__PlainDescription]");
        let text = "";
        // テキストを連結
        descriptionItems.forEach(item => {
          text += item.textContent?.trim() || "";
        });
        return text;
      });
      
      // SES判定処理でtrue, falseかを判定
      const sesFlag = isSes(description);
      // ses判定結果をcardに追加
      allCardData.push({
        ...card,
        sesFlag,
      });
    }
    console.log(pageNum);
    await browser.close();
  }
  console.log(allCardData);
  if(allCardData.length > 0) {
    await saveToMongo(allCardData);
  } else {
    console.warn("データが取得できなかったため、DBの更新は行いませんでした");
  }
  await closeDB();
}
scrapeData();