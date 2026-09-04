const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto('http://127.0.0.1:8126/project-cultural.html?v=' + Date.now(), { waitUntil: 'domcontentloaded', timeout: 15000 });
  await page.waitForTimeout(2000);
  await page.evaluate(() => document.querySelectorAll('.reveal').forEach(el => el.classList.add('revealed', 'in-view')));
  // Section 02
  const s02 = await page.$('text=02 / 项目概览');
  if (s02) { await s02.scrollIntoViewIfNeeded(); await page.waitForTimeout(400); await page.screenshot({ path: 'c:/Users/LIANGJINLING/WorkBuddy/2026-08-11-18-21-46/portfolio_website/cc_s02.png' }); }
  // Section 04
  const s04 = await page.$('text=04 / AIGC 工作流');
  if (s04) { await s04.scrollIntoViewIfNeeded(); await page.waitForTimeout(400); await page.screenshot({ path: 'c:/Users/LIANGJINLING/WorkBuddy/2026-08-11-18-21-46/portfolio_website/cc_s04.png' }); }
  // Section 08
  const s08 = await page.$('text=08 / 最终展示');
  if (s08) { await s08.scrollIntoViewIfNeeded(); await page.waitForTimeout(400); await page.screenshot({ path: 'c:/Users/LIANGJINLING/WorkBuddy/2026-08-11-18-21-46/portfolio_website/cc_s08.png' }); }
  console.log('OK');
  await browser.close();
})();
