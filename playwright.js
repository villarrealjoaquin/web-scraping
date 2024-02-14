import { chromium } from 'playwright';

async function getResultsFromNavigator(query, browser) {
  const page = await browser.newPage();
  await page.goto("https://www.google.com/");
  await page.waitForSelector('textarea[name="q"]');
  await page.fill('textarea[name="q"]', query);
  await page.keyboard.press('Enter');

  await page.waitForNavigation({
    waitUntil: 'networkidle'
  });

  const listResults = await page.evaluate(() => {
    let results = [];
    document.querySelectorAll("div[data-snf] div a").forEach((anchor, index) => {
      results.push({
        index,
        title: anchor.innerText,
        url: anchor.href,
      })
    })
    return results;
  });

  return listResults;
}

async function visitAndGetContent(result, browser) {
  const page = await browser.newPage();
  await page.goto(result.url);
  await page.waitForLoadState('domcontentloaded');
  const content = await page.evaluate(() => {
    const rawText = document.querySelector("main")?.innerText || document.querySelector("body").innerText;
    return rawText;
  });

  return content;
  // await page.close();
}

async function startScraping(query) {
  const browser = await chromium.launch({
    headless: false,
  });
  const allTexts = [];
  const list = await getResultsFromNavigator(query, browser);

  for await (const url of list) {
    const content = await visitAndGetContent(url, browser);
    allTexts.push(content);
  }

  console.log(allTexts);
  await browser.close();
}

let query = process.argv.slice(2)[0];
startScraping(query);

