import puppeteer from "puppeteer";
// import { saveToMongo } from "../db/saveData.js";
// import { closeDB } from "../db/db.js"
import pLimit from "p-limit";
import { CardData } from "../types/card";

export const scrapeData = async () => {

  // 型定義
  // type CardData = {
  //   title: string;
  //   companyName: string;
  //   topImagePic: string;
  //   wantedlyUrl: string | null;
  //   sesFlag?:boolean;
  // };

  // 全カード情報格納
  const allCardData: CardData[] = [];
  // ses企業ワードを配列に格納
  const sesKeywords = ["客先", "常駐", "派遣", "開発支援", "エンジニア支援", "SES", "ses", "配属先", "準委任契約", "クライアント先", "プロジェクト参画", "現場で活躍中！"];
  // NOTses企業ワードを配列に格納
  const notSesKeywords = ["客先常駐なし", "常駐なし", "派遣なし", "SESなし", "内製化"];

  // ses企業判定処理
  const isSes = (text: string): boolean => {
        // 否定ワードが含まれていたらfalse(SESではない)
        if(notSesKeywords.some(keyword => text.includes(keyword))) {
          return false;
        }
        return sesKeywords.some(keyword => text.includes(keyword));
  };
  
  for(let pageNum = 1; pageNum <=50; pageNum++) {

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
          const href = item.querySelector("section a")?.getAttribute("href")?.trim();
          const wantedlyUrl = href ? "https://www.wantedly.com" + href : null;

          // 取得したデータをオブジェクトにまとめて返す
          return {
            title,
            companyName,
            topImagePic,
            wantedlyUrl,
          };
          // 最後にnull以外を取得
        }).filter(item => item !== null && item.wantedlyUrl !== null);
    }) as CardData[];
  
    // 各カードの詳細ページに飛んでSES判定情報を取得
    // 並列化するための並列数(10ページ設定)
    const limit = pLimit(10);

    // 並列処理化する関数
    const processCard = async (card: CardData) => {
      // console.log(`開始: ${card.title}`);
      const detailPage = await browser.newPage();
      
      // ユーザーエージェント設定
      await detailPage.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ' +
        'AppleWebKit/537.36 (KHTML, like Gecko) ' +
        'Chrome/122.0.0.0 Safari/537.36'
      );
  
      // ビューポート設定
      await detailPage.setViewport({
        width: 1280,
        height: 800,
      });

      // 詳細ページにアクセス
      await detailPage.goto(card.wantedlyUrl!, {waitUntil: "domcontentloaded"});

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
      // console.log(`終了: ${card.title}`);
    }
    // limitで並列に実行
    const tasks = pageData.map(card => limit(()=>processCard(card!)));
    // 全てのprocessCardが終わるのを待ってから閉じる
    await Promise.all(tasks);

    console.log(pageNum);
    await browser.close();
  };

  console.log(allCardData);
  if(allCardData.length > 0) {
    // await saveToMongo(allCardData);
    const filteredData = allCardData.filter(item => item.sesFlag === false);
    return filteredData;
  } else {
    console.warn("データが取得できなかったため、データの更新は行いませんでした");
  }
}
// scrapeData();