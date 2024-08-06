class Link {
  constructor(page, linkUrl) {
    this.linkUrl = linkUrl;
    this.page = page;
  }

  async getLinkContent() {
    // Navigate to the link URL and wait until there are no more network connections for at least 500 ms.
    await this.page.goto(this.linkUrl, { waitUntil: "networkidle0", timeout: 60000 });

    // Scrape the link content
    const linkContent = await this.page.evaluate(() => {
      // This code runs in the browser context
      const linkElement = document.querySelector("div.base-site-content");

      return linkElement.innerText;
    });

    return linkContent;
  }
}

module.exports = Link;
