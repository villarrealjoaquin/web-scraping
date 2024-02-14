import puppeteer from "puppeteer";

const getQuotesFromPage = async (page) => {
  return page.evaluate(() => {
    const quoteList = document.querySelectorAll(".quote");
    return Array.from(quoteList).map(quote => {
      const text = quote.querySelector(".text").innerText;
      const author = quote.querySelector(".author").innerText;
      return { text, author };
    });
  });
};

const getQuotes = async () => {
  // Start a Puppeteer session with:
  // - a visible browser (`headless: false` - easier to debug because you'll see the browser in action)
  // - no default viewport (`defaultViewport: null` - website page will in full width and height)
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    slowMo: 200
  });

  // Open a new page
  const page = await browser.newPage();

  // On this new page:
  // - open the "http://quotes.toscrape.com/" website
  // - wait until the dom content is loaded (HTML is ready)
  await page.goto("http://quotes.toscrape.com/", {
    waitUntil: "domcontentloaded",
  });

  const quotes = await getQuotesFromPage(page)
  // Display the quotes
  console.log(quotes);

  await page.click(".quote > span > a");

  const authorData = await page.evaluate(() => {
    const authorInfo = document.querySelector('.author-details');
    const name = authorInfo.querySelector('.author-title').innerText;
    return name;
  });

  console.log(authorData);
  
  // await page.click(".pager > .next > a");



  // const quotesPage2 = await getQuotesFromPage(page)
  // console.log(quotesPage2, 'page 2');

  // Close the browser
  await browser.close();
};

// Start the scraping
getQuotes();

// openWebPage()

async function captureScreenshot() {
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 200
  });
  const page = await browser.newPage();

  await page.goto('https://www.crunchyroll.com/es');
  await page.screenshot({ path: 'example.png' })
  await browser.close()
}

// captureScreenshot()

async function captureClick() {
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 200
  });
  const page = await browser.newPage();

  await page.goto('https://quotes.toscrape.com');
  await page.click('a[href="/login"]')
  await browser.close()
}

// captureClick()

async function getDataFromWebPage() {
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 200
  });
  const page = await browser.newPage();

  await page.goto('https://quotes.toscrape.com');


  await browser.close()
}

// getDataFromWebPage()



// --------------