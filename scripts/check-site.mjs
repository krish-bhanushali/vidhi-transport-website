import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";

const root = process.cwd();
const all = [];
function walk(dir) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if ([".git", ".github", "node_modules", "_site"].includes(ent.name)) continue;
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(full);
    else if (ent.isFile()) all.push(full);
  }
}
walk(root);
const html = all.filter(p => p.endsWith(".html")).sort();
assert(html.length >= 40, `Only ${html.length} HTML pages found`);
const canonicals = new Map();
let linksChecked = 0;
for (const file of html) {
  const text = fs.readFileSync(file, "utf8");
  const name = path.relative(root, file).replaceAll(path.sep, "/");
  const title = text.match(/<title>([^<]+)<\/title>/i)?.[1];
  const description = text.match(/<meta name="description" content="([^"]+)"/i)?.[1];
  const canonical = text.match(/<link rel="canonical" href="([^"]+)"/i)?.[1];
  const h1s = [...text.matchAll(/<h1(?:\s[^>]*)?>([\s\S]*?)<\/h1>/gi)];
  assert(title?.trim(), `${name}: missing title`);
  assert(description?.length >= 50, `${name}: missing or thin description`);
  assert(canonical?.startsWith("https://www.vidhitransport.com/"), `${name}: invalid canonical`);
  assert.equal(h1s.length, 1, `${name}: expected exactly one H1`);
  assert(!canonicals.has(canonical), `${name}: duplicate canonical used by ${canonicals.get(canonical)}`);
  canonicals.set(canonical, name);
  assert(/<meta property="og:title"/i.test(text), `${name}: missing Open Graph title`);
  assert(/<meta property="og:description"/i.test(text), `${name}: missing Open Graph description`);
  const jsonBlocks = [...text.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi)];
  assert(jsonBlocks.length >= 1, `${name}: missing JSON-LD`);
  for (const block of jsonBlocks) JSON.parse(block[1]);
  for (const match of text.matchAll(/(?:href|src)="([^"]+)"/gi)) {
    const href = match[1];
    if (/^(?:https?:|mailto:|tel:|data:|#|\/\/)/i.test(href)) continue;
    const cleaned = href.split("#", 1)[0].split("?", 1)[0];
    if (!cleaned) continue;
    const dest = path.resolve(path.dirname(file), cleaned);
    assert(dest.startsWith(root + path.sep), `${name}: reference escapes site root ${href}`);
    assert(fs.existsSync(dest), `${name}: broken link ${href}`);
    linksChecked++;
  }
}
const sitemap = fs.readFileSync(path.join(root, "sitemap.xml"), "utf8");
for (const [canonical, name] of canonicals) {
  if (["404.html", "privacy.html", "terms.html"].includes(name)) continue;
  assert(sitemap.includes("<loc>" + canonical + "</loc>"), `${name}: missing sitemap URL`);
}
const robots = fs.readFileSync(path.join(root, "robots.txt"), "utf8");
assert(robots.includes("Sitemap: https://www.vidhitransport.com/sitemap.xml"), "robots.txt sitemap missing");
console.log(`PASS: ${html.length} HTML pages, ${linksChecked} local links/assets, canonical URLs, metadata, unique H1s, valid JSON-LD, sitemap and robots.txt.`);
