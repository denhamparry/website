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
    const htmlClass = await page.$eval('html', el => el.className);
    expect(htmlClass).toContain('dark');
  });

  test('Theme toggle works', async () => {
    await page.goto(baseUrl);
    
    // Click theme toggle
    await page.click('#theme-toggle');
    
    // Check if theme changed
    const htmlClass = await page.$eval('html', el => el.className);
    expect(htmlClass).not.toContain('dark');
    
    // Toggle back
    await page.click('#theme-toggle');
    const htmlClassAfter = await page.$eval('html', el => el.className);
    expect(htmlClassAfter).toContain('dark');
  });

  test('404 page works', async () => {
    const response = await page.goto(`${baseUrl}/non-existent-page`, { waitUntil: 'networkidle0' });
    expect(response.status()).toBe(404);
    
    const pageTitle = await page.$eval('h1', el => el.textContent);
    expect(pageTitle).toBe('404');
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