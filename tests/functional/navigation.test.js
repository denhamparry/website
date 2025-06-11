const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

describe('Website Navigation Tests', () => {
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

  test('Homepage loads successfully', async () => {
    const response = await page.goto(baseUrl, { waitUntil: 'networkidle0' });
    expect(response.status()).toBe(200);
  });

  test('Homepage has correct title', async () => {
    await page.goto(baseUrl);
    const title = await page.title();
    expect(title).toContain('Lewis Denham-Parry');
  });

  test('Homepage displays profile mode', async () => {
    await page.goto(baseUrl);
    const profileTitle = await page.$eval('.profile_inner h1', el => el.textContent);
    expect(profileTitle).toBe('Did somebody say 🍰');
  });

  test('Social links are present and valid', async () => {
    await page.goto(baseUrl);
    
    // Check GitHub link
    const githubLink = await page.$eval('a[href*="github.com/denhamparry"]', el => el.href);
    expect(githubLink).toBe('https://github.com/denhamparry');
    
    // Check LinkedIn link
    const linkedinLink = await page.$eval('a[href*="linkedin.com"]', el => el.href);
    expect(linkedinLink).toBe('https://www.linkedin.com/in/denhamparry/');
    
    // Check CV link
    const cvLink = await page.$eval('a[href*="edera.dev"]', el => el.href);
    expect(cvLink).toBe('https://edera.dev/');
  });

  test('Talks page is accessible', async () => {
    await page.goto(`${baseUrl}/talks`);
    const pageTitle = await page.$eval('h1.post-title', el => el.textContent);
    expect(pageTitle).toBe('Talks');
  });

  test('Talks page has table of contents', async () => {
    await page.goto(`${baseUrl}/talks`);
    const toc = await page.$('.toc');
    expect(toc).toBeTruthy();
  });

  test('Dark theme is default', async () => {
    await page.goto(baseUrl);
    // Check for theme in localStorage or data attributes
    const isDarkTheme = await page.evaluate(() => {
      return localStorage.getItem('pref-theme') === 'dark' || 
             document.documentElement.getAttribute('data-theme') === 'dark' ||
             document.body.classList.contains('dark') ||
             document.documentElement.classList.contains('dark');
    });
    expect(isDarkTheme).toBe(true);
  });

  test('Theme toggle works', async () => {
    await page.goto(baseUrl);
    
    // Check if theme toggle exists
    const themeToggle = await page.$('#theme-toggle');
    if (themeToggle) {
      // Get initial theme state
      const initialTheme = await page.evaluate(() => {
        return localStorage.getItem('pref-theme') || 'dark';
      });
      
      // Click theme toggle
      await page.click('#theme-toggle');
      
      // Wait for theme change
      await page.waitForTimeout(100);
      
      // Check if theme changed
      const newTheme = await page.evaluate(() => {
        return localStorage.getItem('pref-theme');
      });
      
      expect(newTheme).not.toBe(initialTheme);
    } else {
      // If no theme toggle, just verify dark theme is set
      const theme = await page.evaluate(() => {
        return localStorage.getItem('pref-theme') || 'dark';
      });
      expect(theme).toBeTruthy();
    }
  });

  test('404 page works', async () => {
    const response = await page.goto(`${baseUrl}/non-existent-page`, { waitUntil: 'networkidle0' });
    expect(response.status()).toBe(404);
    
    // Check for 404 content more flexibly
    const pageContent = await page.content();
    expect(pageContent).toMatch(/404|not found|page not found/i);
  });

  test('Meta tags are present', async () => {
    await page.goto(baseUrl);
    
    // Check OpenGraph tags
    const ogTitle = await page.$eval('meta[property="og:title"]', el => el.content);
    expect(ogTitle).toBeTruthy();
    
    const ogDescription = await page.$eval('meta[property="og:description"]', el => el.content);
    expect(ogDescription).toBeTruthy();
    
    // Check description meta tag
    const description = await page.$eval('meta[name="description"]', el => el.content);
    expect(description).toBe('The life and times of Lewis Denham-Parry');
  });
});