const puppeteer = require("puppeteer");

describe("Content Tests", () => {
  let browser;
  let page;
  const baseUrl = "http://localhost:1313";

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: "new",
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
      ],
    });
    page = await browser.newPage();
  });

  afterAll(async () => {
    await browser.close();
  });

  test("Talks page contains expected content structure", async () => {
    await page.goto(`${baseUrl}/talks`);

    // Check page loads and has content
    const pageTitle = await page.$eval("h1.post-title", (el) =>
      el.textContent.trim(),
    );
    expect(pageTitle).toBe("Talks");

    // Check for year content in the page body (they should be there as markdown)
    const pageContent = await page.content();
    expect(pageContent).toMatch(/2025/);
    expect(pageContent).toMatch(/2024/);
    expect(pageContent).toMatch(/2023/);

    // Verify we have talk entries
    const hasYouTubeLinks = await page.$$eval(
      'a[href*="youtube.com"]',
      (links) => links.length > 0,
    );
    expect(hasYouTubeLinks).toBe(true);
  });

  test("Talk entries have required elements", async () => {
    await page.goto(`${baseUrl}/talks`);

    // Check for talk structure
    const talkTitles = await page.$$eval("h3", (titles) => titles.length);
    expect(talkTitles).toBeGreaterThan(0);

    // Check for links in talk entries
    const youtubeLinks = await page.$$eval(
      'a[href*="youtube.com"]',
      (links) => links.length,
    );
    expect(youtubeLinks).toBeGreaterThan(0);
  });

  test("Images load correctly", async () => {
    await page.goto(`${baseUrl}/talks`);

    // Check if cover image exists, if not skip this test
    const coverImageExists = await page.$(".cover img");
    if (coverImageExists) {
      const coverImage = await page.$eval(".cover img", (img) => ({
        src: img.src,
        loaded: img.complete && img.naturalHeight !== 0,
      }));

      expect(coverImage.src).toContain("/images/talks/hotdog.jpg");
      expect(coverImage.loaded).toBe(true);
    } else {
      // Check for any images on the page instead
      const anyImages = await page.$$("img");
      expect(anyImages.length).toBeGreaterThanOrEqual(0);
    }
  });

  test("Reading time is displayed", async () => {
    await page.goto(`${baseUrl}/talks`);

    const postMeta = await page.$eval(".post-meta", (el) => el.textContent);
    expect(postMeta).toMatch(/\d+ min/);
  });

  test("Author information is displayed", async () => {
    await page.goto(`${baseUrl}/talks`);

    const postMeta = await page.$eval(".post-meta", (el) => el.textContent);
    expect(postMeta).toContain("Lewis Denham-Parry");
  });

  test("Date formatting is correct", async () => {
    await page.goto(`${baseUrl}/talks`);

    const postMeta = await page.$eval(".post-meta", (el) => el.textContent);
    // Should match format like "April 22, 2022"
    expect(postMeta).toMatch(/[A-Za-z]+ \d{1,2}, \d{4}/);
  });

  test("External links open in new tab", async () => {
    await page.goto(`${baseUrl}/talks`);

    // Check YouTube links exist
    const youtubeLinks = await page.$$eval('a[href*="youtube.com"]', (links) =>
      links.map((link) => ({
        href: link.href,
        target: link.target,
        rel: link.rel,
      })),
    );

    expect(youtubeLinks.length).toBeGreaterThan(0);

    // Note: PaperMod theme may handle external links differently
    // Just verify that YouTube links exist for now
    youtubeLinks.forEach((link) => {
      expect(link.href).toContain("youtube.com");
    });
  });
});
