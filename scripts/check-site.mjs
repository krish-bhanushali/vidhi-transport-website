// Static release-gate checks against the built publish/ folder (no server needed).
import fs from 'node:fs';
import path from 'node:path';

const out = path.resolve('publish');
const SITE = 'https://www.vidhitransport.com';
const base = (process.env.BASE_PATH || '/').replace(/\/$/, '');
const errors = [];
const warn = [];
const fail = (m) => errors.push(m);

const all = [];
(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const f = path.join(d, e.name);
    if (e.isDirectory()) walk(f);
    else all.push(f);
  }
})(out);
const html = all.filter((f) => f.endsWith('.html')).sort();
const titles = new Map(), descs = new Map(), canons = new Map();
let refs = 0;

const resolveRef = (file, ref) => {
  let p = ref.split('#')[0].split('?')[0];
  if (!p) return null;
  if (p.startsWith('/')) {
    if (base && !p.startsWith(base + '/') && p !== base) return { bad: `not base-prefixed: ${ref}` };
    p = p.slice(base.length) || '/';
    let dest = path.join(out, decodeURI(p));
    if (p.endsWith('/')) dest = path.join(dest, 'index.html');
    return { dest };
  }
  return { dest: path.resolve(path.dirname(file), decodeURI(p)) };
};

for (const f of html) {
  const name = path.relative(out, f).split(path.sep).join('/');
  const t = fs.readFileSync(f, 'utf8');
  const title = t.match(/<title>([^<]*)<\/title>/)?.[1]?.trim();
  const desc = t.match(/<meta name="description" content="([^"]*)"/)?.[1];
  const canon = t.match(/<link rel="canonical" href="([^"]*)"/)?.[1];
  const h1 = (t.match(/<h1[\s>]/g) || []).length;
  const noindex = /<meta name="robots" content="noindex/.test(t);
  if (!title) fail(`${name}: no <title>`);
  if (!desc || desc.length < 50) fail(`${name}: description missing/thin`);
  if (desc && desc.length > 170) warn.push(`${name}: description ${desc.length} chars`);
  if (title && title.length > 70) warn.push(`${name}: title ${title.length} chars`);
  if (h1 !== 1) fail(`${name}: ${h1} H1 elements`);
  if (!/<html lang="en(-IN)?"/.test(t)) fail(`${name}: missing lang`);
  if (name !== '404.html') {
    if (!canon?.startsWith(SITE + '/')) fail(`${name}: bad canonical ${canon}`);
    const expect = SITE + '/' + (name === 'index.html' ? '' : name);
    if (canon && canon !== expect) fail(`${name}: canonical ${canon} != ${expect}`);
    for (const [m, k] of [[titles, title], [descs, desc], [canons, canon]]) {
      if (m.has(k)) fail(`${name}: duplicate ${k} (also ${m.get(k)})`);
      m.set(k, name);
    }
    if (!base && noindex && name !== '404.html') fail(`${name}: noindex in production build`);
  }
  for (const p of ['og:title', 'og:description', 'og:url', 'og:image']) if (!t.includes(`property="${p}"`)) fail(`${name}: missing ${p}`);
  for (const m of t.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try { JSON.parse(m[1]); } catch (e) { fail(`${name}: invalid JSON-LD (${e.message})`); }
  }
  // Text present without JS: strip scripts/styles/tags and require real copy inside <main>.
  const main = t.match(/<main[\s\S]*?<\/main>/)?.[0] || '';
  const text = main.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
  if (name !== '404.html' && text.length < 800) fail(`${name}: only ${text.length} chars of main text in HTML`);
  if (/undefined|\[object Object\]/.test(text)) fail(`${name}: "undefined" rendered in text`);
  for (const m of t.matchAll(/\s(?:href|src|srcset)="([^"]+)"/g)) {
    for (const ref of m[1].split(',').map((s) => s.trim().split(/\s+/)[0])) {
      if (/^(https?:|mailto:|tel:|data:|#|\/\/|javascript:)/.test(ref) || !ref) continue;
      const r = resolveRef(f, ref);
      if (!r) continue;
      refs++;
      if (r.bad) fail(`${name}: ${r.bad}`);
      else if (!fs.existsSync(r.dest)) fail(`${name}: broken reference ${ref}`);
    }
  }
  for (const m of t.matchAll(/href="#([^"]+)"/g)) if (!t.includes(`id="${m[1]}"`)) fail(`${name}: in-page anchor #${m[1]} has no target`);
  for (const m of t.matchAll(/<img\b[^>]*>/g)) {
    if (!/\salt(=|\s|>)/.test(m[0])) fail(`${name}: img without alt`);
    if (!/\swidth="/.test(m[0]) || !/\sheight="/.test(m[0])) fail(`${name}: img without width/height ${m[0].slice(0, 80)}`);
  }
}
// CSS url() references
for (const f of all.filter((x) => x.endsWith('.css'))) {
  for (const m of fs.readFileSync(f, 'utf8').matchAll(/url\(["']?([^"')]+)["']?\)/g)) {
    if (/^(data:|https?:|#)/.test(m[1])) continue;
    const r = resolveRef(f, m[1]); refs++;
    if (!r || r.bad || !fs.existsSync(r.dest)) fail(`${path.basename(f)}: broken css url ${m[1]}`);
  }
}
// Live URL preservation
for (const u of fs.readFileSync('scripts/live-urls.txt', 'utf8').split('\n').filter(Boolean)) {
  const file = path.join(out, u === '/' ? 'index.html' : u);
  if (!fs.existsSync(file)) fail(`live URL not preserved: ${u}`);
}
const sm = fs.readFileSync(path.join(out, 'sitemap.xml'), 'utf8');
for (const [c, n] of canons) if (n !== 'privacy.html' && !sm.includes(`<loc>${c}</loc>`)) fail(`${n}: not in sitemap`);
const rb = fs.readFileSync(path.join(out, 'robots.txt'), 'utf8');
if (!base && !rb.includes(`Sitemap: ${SITE}/sitemap.xml`)) fail('robots.txt: sitemap line missing');

for (const w of warn) console.warn('warn  ' + w);
if (errors.length) { for (const e of errors) console.error('FAIL  ' + e); console.error(`\n${errors.length} problem(s).`); process.exit(1); }
console.log(`PASS: ${html.length} HTML pages, ${refs} local links/assets resolved, unique titles/descriptions/canonicals, one H1 each, OG tags, valid JSON-LD, JS-off text present, all ${fs.readFileSync('scripts/live-urls.txt', 'utf8').split('\n').filter(Boolean).length} live URLs preserved, sitemap + robots OK.`);
