const e = require("express");
const puppeteer = require("puppeteer");

const scrapeMemes = async (serchPhrase) => {
  try {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(120000); // Increase the timeout to 2 minutes

    // Navigate to the URL
    await page.goto("https://memes.com/");

    // Perform the search by typing "dog" into the search bar and pressing Enter
    await page.waitForSelector(".search-bar");
    await page.type(".search-bar", serchPhrase);
    await page.screenshot({ path: "pic1.png" });

    await page.keyboard.press("Enter");

    // Wait for the search results to load
    await page.waitForSelector(".post-tile");
    await page.screenshot({ path: "pic2.png" });

    // Select the first search resultw
    const firstSearchResult = ".pt-5 a.post-tile";
    await page.waitForSelector(firstSearchResult);
    await page.click(firstSearchResult);

    // Wait for the page to load
    await page.waitForSelector(".post-media-container");
    await page.screenshot({ path: "pic3.png" });

    // Scrape the image URL from the selected search result
    const image = await page.$(".w-100");
    const imageUrl = await page.evaluate((image) => image.src, image);

    // Close the browser
    await browser.close();

    return imageUrl;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};

module.exports = scrapeMemes;
