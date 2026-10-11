// Usage: node scripts/overflow.mjs  (preview must be running on :4175). Checks every page for horizontal overflow + console errors.
import { chromium } from 'playwright-core';
import fs from 'node:fs';
import path from 'node:path';
const pages = [];
(function walk(d) { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const f = path.join(d, e.name); if (e.isDirectory()) walk(f); else if (e.name.endsWith('.html')) pages.push('/' + path.relative('publish', f).split(path.sep).join('/')); } })('publish');
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox'] });
let bad = 0;
for (const w of (process.env.SIZES || '375,768,1440').split(',').map(Number)) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 900 } });
  for (const p of pages) {
    const page = await ctx.newPage();
    const errs = [];
    page.on('pageerror', (e) => errs.push(e.message));
    page.on('console', (m) => m.type() === 'error' && errs.push(m.text()));
    page.on('requestfailed', (r) => { if (r.url().startsWith('http://localhost')) errs.push('failed ' + r.url()); });
    page.on('response', (r) => { if (r.url().startsWith('http://localhost') && r.status() >= 400 && !p.includes('404')) errs.push(r.status() + ' ' + r.url()); });
    await page.goto('http://localhost:4175' + p, { waitUntil: 'load' });
    const o = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    if (o > 0 || errs.length) { bad++; console.log(w, p, 'overflow', o, errs.join(' | ')); }
    await page.close();
  }
  await ctx.close();
}
console.log(bad ? `${bad} issue(s)` : `OK: ${pages.length} pages x ${(process.env.SIZES || "375,768,1440").split(",").length} widths, no overflow, no console/network errors`);
await browser.close();
