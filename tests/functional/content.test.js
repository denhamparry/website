const puppeteer = require('puppeteer');

describe('Content Tests', () => {
  let browser;
  let page;
  const baseUrl = 'http://localhost:1313';

  beforeAll(async () => {
    browser = await puppeteer.launch({ 
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });
    page = await browser.newPage();
  });

  afterAll(async () => {
    await browser.close();
  });

  test('Talks page contains expected content structure', async () => {
    await page.goto(`${baseUrl}/talks`);
    
    // Check for year headings
    const yearHeadings = await page.$$eval('h2', headings => 
      headings.map(h => h.textContent).filter(text => /^\d{4}$/.test(text))
    );
    expect(yearHeadings.length).toBeGreaterThan(0);
    expect(yearHeadings).toContain('2025');
    expect(yearHeadings).toContain('2024');
  });

  test('Talk entries have required elements', async () => {
    await page.goto(`${baseUrl}/talks`);
    
    // Check for talk structure
    const talkTitles = await page.$$eval('h3', titles => titles.length);
    expect(talkTitles).toBeGreaterThan(0);
    
    // Check for links in talk entries
    const youtubeLinks = await page.$$eval('a[href*="youtube.com"]', links => links.length);
    expect(youtubeLinks).toBeGreaterThan(0);
  });

  test('Images load correctly', async () => {
    await page.goto(`${baseUrl}/talks`);
    
    // Check cover image
    const coverImage = await page.$eval('.cover img', img => ({
      src: img.src,
      loaded: img.complete && img.naturalHeight !== 0
    }));
    
    expect(coverImage.src).toContain('/images/talks/hotdog.jpg');
    expect(coverImage.loaded).toBe(true);
  });

  test('Reading time is displayed', async () => {
    await page.goto(`${baseUrl}/talks`);
    
    const postMeta = await page.$eval('.post-meta', el => el.textContent);
    expect(postMeta).toMatch(/\d+ min/);
  });

  test('Author information is displayed', async () => {
    await page.goto(`${baseUrl}/talks`);
    
    const postMeta = await page.$eval('.post-meta', el => el.textContent);
    expect(postMeta).toContain('Lewis Denham-Parry');
  });

  test('Date formatting is correct', async () => {
    await page.goto(`${baseUrl}/talks`);
    
    const postMeta = await page.$eval('.post-meta', el => el.textContent);
    // Should match format like "April 22, 2022"
    expect(postMeta).toMatch(/[A-Za-z]+ \d{1,2}, \d{4}/);
  });

  test('External links open in new tab', async () => {
    await page.goto(`${baseUrl}/talks`);
    
    // Check YouTube links have target="_blank"
    const externalLinks = await page.$$eval('a[href^="http"]:not([href*="denhamparry.co.uk"])', links => 
      links.map(link => ({
        href: link.href,
        target: link.target,
        rel: link.rel
      }))
    );
    
    externalLinks.forEach(link => {
      if (link.href.includes('youtube.com') || link.href.includes('github.com')) {
        expect(link.target).toBe('_blank');
        expect(link.rel).toContain('noopener');
      }
    });
  });
});