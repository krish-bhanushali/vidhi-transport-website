// Runs after `astro build`: writes sitemap.xml, robots.txt and .nojekyll into publish/.
import fs from 'node:fs';
import path from 'node:path';

const out = path.resolve('publish');
const SITE = 'https://www.vidhitransport.com';
const base = (process.env.BASE_PATH || '/').replace(/\/$/, '');
const staging = base !== '';
const today = new Date().toISOString().slice(0, 10);

const files = [];
(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const f = path.join(d, e.name);
    if (e.isDirectory()) walk(f);
    else if (e.name.endsWith('.html')) files.push(f);
  }
})(out);

const prio = (p) => (p === '/' ? '1.0' : /^\/(services|contact_us|branch-locator|lr-track)/.test(p) ? '0.9' : /^\/(branches|areas)\//.test(p) ? '0.8' : '0.6');
const urls = [];
for (const f of files.sort()) {
  const html = fs.readFileSync(f, 'utf8');
  if (/<meta name="robots" content="noindex/.test(html) && !staging) continue;
  const rel = '/' + path.relative(out, f).split(path.sep).join('/');
  if (rel === '/404.html') continue;
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  if (!canonical) continue;
  const p = canonical.replace(SITE, '');
  urls.push(`  <url><loc>${canonical}</loc><lastmod>${today}</lastmod><priority>${prio(p)}</priority></url>`);
}
fs.writeFileSync(path.join(out, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`);
fs.writeFileSync(
  path.join(out, 'robots.txt'),
  staging
    ? '# Staging preview: pages carry <meta name="robots" content="noindex">.\nUser-agent: *\nAllow: /\n'
    : `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`
);
fs.writeFileSync(path.join(out, '.nojekyll'), '');
console.log(`postbuild: sitemap.xml (${urls.length} URLs), robots.txt${staging ? ' [staging]' : ''}`);
