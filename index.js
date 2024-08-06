const Tweet = require("./src/tweet.js");
const Link = require("./src/link.js");
const generateResponse = require("./src/responseGenerator.js");
const getLatestTweets = require("./src/getTweets.js");
const tweetReply = require("./src/tweetReply.js");
const { saveId, findId } = require("./src/readWriteFile.js");
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());

function isRuntimeLimitReached(startTime) {
  runtimeLimitInMinutes = 5;
  const elapsedMinutes = Math.floor((Date.now() - startTime) / (1000 * 60));
  return elapsedMinutes >= runtimeLimitInMinutes;
}

async function run(event, context) {
  startTime = Date.now();
  try {
    console.log(
      `//------------ BLOGTO BOT AWAKENED. TIME: ${new Date().toISOString()} ------------//`
    );
    const browser = await puppeteer.launch({ headless: true });
    console.log("Browser launched");
    const page = await browser.newPage();
    await page.setJavaScriptEnabled(true);

    await page.setUserAgent(
      // "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
      // "(KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3"
      "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; Googlebot/2.1; +http://www.google.com/bot.html) Chrome/W.X.Y.Z Safari/537.36"
    );
    await page.setViewport({ width: 1366, height: 768 });

    console.log("Getting latest tweets...");
    const latestTweets = await getLatestTweets(page, 5);
    console.log("Latest tweets: ", latestTweets);
    console.log("Filtering replied tweets...");
    const filteredTweets = latestTweets.filter((tweetId) => !findId(tweetId));
    console.log("Filtered tweets: ", filteredTweets);

    for (const tweetId of filteredTweets) {
      if (isRuntimeLimitReached(startTime)) {
        console.log(`Runtime limit of ${runtimeLimitInMinutes} minutes reached. Exiting.`);
        process.exit(0); // Gracefully exit the script
      }
      const tweetUrl = `https://twitter.com/blogTO/status/${tweetId}`;
      const tweet = new Tweet(page, tweetUrl);
      console.log("Getting tweet content...");
      const { tweetContent, linkUrl } = await tweet.getTweetContent();
      console.log("Tweet content: ", tweetContent);
      console.log("Tweet ID: ", tweetId);
      console.log("Link: ", linkUrl);

      const link = new Link(page, linkUrl);
      console.log("Getting link content...");
      const linkContent = await link.getLinkContent().catch((error) => {
        console.log("Error getting link content: ", error);
        return null;
      });
      if (!linkContent) {
        console.log("Couldn't get link content. Skipping tweet.");
        continue;
      }
      console.log("Got link content");
      let response;
      let responseTries = 0;
      const maxResponseTries = 1;
      while ((!response || response.length > 280) && responseTries < maxResponseTries) {
        console.log("generating response...");
        response = await generateResponse(tweetContent, linkContent);
        console.log("Response: ", response);
        responseTries++;
      }

      if (response.length <= 280) {
        console.log("Replying to tweet...");
        const reply = await tweetReply(response, tweetId);
        if (reply?.data?.id) {
          saveId(tweetId);
          console.log("Reply ID: ", reply.data.id);
        } else {
          console.log("couldn't reply to tweet");
        }
      } else {
        console.log("Response too long. Skipping tweet.");
      }
    }

    await browser.close();
  } catch (error) {
    console.log(error);
  }
}

if (require.main === module) {
  run().catch((error) => console.error(error));
}
