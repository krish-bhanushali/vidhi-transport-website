// Usage: node scripts/screens.mjs <outdir> <path>... (serves must be running on :4175)
import { chromium } from 'playwright-core';
import fs from 'node:fs';
const [out, ...paths] = process.argv.slice(2);
fs.mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
const sizes = (process.env.SIZES || '1440,390').split(',').map(Number);
for (const p of paths) {
  for (const w of sizes) {
    const page = await browser.newPage({ viewport: { width: w, height: 900 }, deviceScaleFactor: 1 });
    const errors = [];
    page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
    page.on('pageerror', (e) => errors.push(e.message));
    await page.goto('http://localhost:4175' + p, { waitUntil: 'networkidle' });
    // reveal everything for the screenshot
    await page.evaluate(async () => {
      document.querySelectorAll('.reveal').forEach((e) => e.classList.add('is-in'));
      document.querySelectorAll('[data-network]').forEach((e) => e.classList.add('is-visible'));
      document.querySelectorAll('img[loading=lazy]').forEach((i) => (i.loading = 'eager')); await new Promise((r) => setTimeout(r, 800)); window.scrollTo(0, 0);
    });
    await page.waitForTimeout(1500);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    const name = (p === '/' ? 'home' : p.replace(/^\//, '').replace(/\//g, '_').replace('.html', '')) + `-${w}.png`;
    await page.screenshot({ path: `${out}/${name}`, fullPage: true });
    console.log(name, 'overflow', overflow, errors.length ? 'ERRORS ' + errors.join(' | ') : '');
    await page.close();
  }
}
await browser.close();
