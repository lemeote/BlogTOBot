async function autoScroll(page) {
  await page.evaluate(async () => {
    return await new Promise((resolve, reject) => {
      let totalHeight = 0;
      let distance = 100;
      let maxScrolls = 20; // Change this to control the number of scroll actions
      let scrollCount = 0;
      let timer = setInterval(() => {
        let scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;
        scrollCount++;

        if (totalHeight >= scrollHeight || scrollCount >= maxScrolls) {
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  });
}

async function getLatestTweets(page, numOfTweets) {
  await page.goto("https://twitter.com/blogTO", { waitUntil: "networkidle0" });
  await page.waitForTimeout(5000);

  let tweetUrlsSet = new Map();
  let scrollCount = 0;
  let maxScrolls = 10;

  // log page content
  const content = await page.content();
  // console.log("Page content: ", content);
  // take a screenshot of page
  await page.screenshot({ path: "screenshot.png" });

  // Regular expression to match URLs
  const urlRegExp = /(http|https):\/\/[^\s]+/g;

  // Keep scrolling until we have at least 5 valid URLs or we have scrolled a certain number of times
  while (tweetUrlsSet.size < numOfTweets && scrollCount < maxScrolls) {
    const tweetData = await page.evaluate(() => {
      const tweetArticles = Array.from(document.querySelectorAll("article"));
      return tweetArticles
        .map((article) => {
          const urlElement = article.querySelector('a[href*="/status/"]:not([href*="/analytics"])');
          const textElement = article.querySelector('div[data-testid="tweetText"]');
          return {
            url: urlElement ? urlElement.href : null,
            text: textElement ? textElement.textContent : null,
          };
        })
        .filter((data) => data.url && data.text);
    });

    // Check each tweet's text and add its URL to the set if it's valid
    tweetData.forEach((data) => {
      if (urlRegExp.test(data.text)) {
        tweetUrlsSet.set(data.url, data.text);
      }
    });
    await autoScroll(page);
    scrollCount++;
  }

  // Converting the Map to an Array
  let tweetDataArray = Array.from(tweetUrlsSet.entries());

  // Getting only the latest 5 tweets
  const latestFiveTweets = tweetDataArray
    .slice(0, numOfTweets)
    .map((tweetData) => tweetData[0])
    .map((tweetUrl) => tweetUrl.split("/").pop());

  return latestFiveTweets;
}

module.exports = getLatestTweets;
