import puppeteer from "puppeteer";

const scrapeData = async () => {
  // puppeteerでブラウザを立ち上げる
  const browser = await puppeteer.launch({headless: false, args: ['--no-sandbox'],});
  const page = await browser.newPage();

  // スクレイピングしたいURLにアクセス
  const url = "https://www.wantedly.com/projects?new=true&page=1&occupationTypes=jp__engineering&jp__engineering=jp__web_engineer&hiringTypes=mid_career&order=recent";
  await page.goto(url, {waitUntil: "domcontentloaded"});
  
  // ５秒間待機
  // const wait = (seconds: number) => new Promise(resolve => setTimeout(resolve, seconds * 1000));
  // await wait(5);
  type CardData = {
    title: string;
    companyName: string;
    topImagePic: string;
    wantedlyUrl: string;
  };
  // 全カード情報格納
  const allCardData: CardData[] = [];

  // 必要なデータを抽出
  const pageData = await page.evaluate(() => {
    // １ページの企業情報をliタグを取得
    const items = document.querySelectorAll("li[class*='ProjectListJobPostsMobile__ProjectListItem']");
    
    return Array.from(items).map(item => {
      const title = item.querySelector("h2[class*='ProjectListJobPostItem__TitleText']")?.textContent || "No title found";
      const companyName = item.querySelector("#company-name")?.textContent || "No company-name found";
      const topImagePic = item.querySelector("section img")?.getAttribute("src") || "No image found";
      const wantedlyUrl = "https://www.wantedly.com" + item.querySelector("section a")?.getAttribute("href") || "";
      // 取得したデータをオブジェクトにまとめて返す
      return {
        title,
        companyName,
        topImagePic,
        wantedlyUrl,
      };
    })
  });
  
  allCardData.push(...pageData);
  
  console.log(allCardData);
  await browser.close();
}

scrapeData();