const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto('http://127.0.0.1:8126/project-cultural.html?v=' + Date.now(), { waitUntil: 'domcontentloaded', timeout: 15000 });
  await page.waitForTimeout(2500);
  // Hero screenshot
  await page.screenshot({ path: 'c:/Users/LIANGJINLING/WorkBuddy/2026-08-11-18-21-46/portfolio_website/cc_hero.png' });
  // Check remaining English text
  const enText = await page.evaluate(() => {
    const body = document.body.innerText;
    const matches = body.match(/[A-Z][A-Z\s&×·→↓]{3,}/g) || [];
    return matches.slice(0, 20);
  });
  console.log('Remaining EN:', JSON.stringify(enText));
  await browser.close();
})();
