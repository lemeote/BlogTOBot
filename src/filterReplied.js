async function checkReplied(page, tweetId) {
  // Go to the tweet URL
  await page.goto(`https://twitter.com/user/status/${tweetId}`, { waitUntil: "networkidle0" });

  // Wait for the initial tweet to load
  await page.waitForSelector('div[data-testid="cellInnerDiv"]', { timeout: 5000 });

  // Click on the "Show more replies" button until it no longer exists
  let showMoreRepliesButton = await page.$x(
    '//div[@role="button"]//span[contains(., "Show more replies")]'
  );
  let clickedCount = 0;
  while (showMoreRepliesButton.length > 0 && clickedCount < 3) {
    // Wait for the button to be visible
    await page.waitForXPath('//div[@role="button"]//span[contains(., "Show more replies")]', {
      visible: true,
    });
    // Click the button and wait for a delay
    await showMoreRepliesButton[0].click();
    await page.waitForTimeout(2000); // wait for 2 seconds

    await page.waitForXPath('//div[@role="button"]//span[contains(., "Show")]', {
      visible: true,
    });

    // Check if the button still exists
    showMoreRepliesButton = await page.$x(
      '//div[@role="button"]//span[contains(., "Show more replies")]'
    );
    clickedCount++;
  }

  const replies = await page.evaluate(() => {
    const replyElements = document.querySelectorAll('div[data-testid="User-Name"]');
    const replyTexts = Array.from(replyElements).map((el) => el.innerText);
    return replyTexts;
  });

  // Check if any reply contains "@nomoreclickbait"
  const found = replies.some((reply) => reply.includes("@nomoreclickbait"));
  return found;
}

module.exports = checkReplied;
