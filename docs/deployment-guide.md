# Deployment guide (owner-readable)

## In one sentence
Upload **the contents of the `publish/` folder** (not the folder itself) into `public_html/` on the existing hosting. Nothing else is needed on the server: no Node.js, PHP, database or build step.

## What is in `publish/`
```
publish/
├── index.html, about-us.html, services.html, contact_us.html, Clientele.html … (all 54 existing pages + privacy.html + 404.html)
├── services/   9 service pages
├── branches/   8 branch pages
├── areas/      14 area pages
├── blog/       3 articles
├── assets/     build/ (CSS, JS, fonts, WebP images), images/ (logo, badges, OG image), logo/
├── favicon.svg, apple-touch-icon.png
├── sitemap.xml, robots.txt
└── .nojekyll   (only matters for GitHub Pages; harmless elsewhere)
```

## Step by step (cPanel / any shared host)
1. **Back up the current live site first.** In cPanel → File Manager → select everything in `public_html` → Compress → download the zip. Keep it; it is your rollback.
2. Get the files: either download the repo ZIP from GitHub (`Code → Download ZIP`) and use its `publish/` folder, or build it yourself (below).
3. In File Manager, open `public_html`, upload a zip of the *contents* of `publish/`, then Extract. Allow it to overwrite existing files with the same name.
4. Do **not** delete old files you don't recognise yet (e.g. old `assets/js/tracking.js`); they are harmless and deleting them can be done later.
5. Optional but recommended: open `public_html/.htaccess` (create it if missing) and append the lines from `deploy/htaccess-redirects.txt` (301s for old URLs that 404 today, and the 404 page). Only uncomment the https/www block if your host does not already force `https://www.`.
6. Visit `https://www.vidhitransport.com/`, `/services/full-truck-load.html`, `/branches/dahej.html`, `/lr-track.html` (try a real LR), `/contact_us.html` (prepare a WhatsApp message) and a URL that doesn't exist (should show the 404 page).
7. Search Console: submit `https://www.vidhitransport.com/sitemap.xml`; run URL Inspection on the homepage and one branch page. See `docs/launch-checklist.md`.

## Rolling back
Upload and extract the zip from step 1 over `public_html`. Or, from the repository: `git checkout pre-redesign-backup` gives the previous repo state; the live site's own backup is the cPanel zip.

## Building `publish/` yourself (developer machine or CI, not the host)
```bash
npm ci
npm run build      # astro build + sitemap/robots → publish/
npm run check      # release-gate checks: metadata, links, assets, schema, sitemap, live URL preservation
npm run preview    # python3 -m http.server 4175 --directory publish → http://localhost:4175
```
Requires Node 20+ and Python 3 (only for the local preview).

## Editing content
All copy lives in data files — edit, rebuild, upload:
- Company facts (phone, email, hours, address): `src/config/site.ts`
- Branches: `src/data/branches.json`
- Services: `src/data/services.json`
- Articles: `src/data/articles.json`
- Other pages: `src/data/pages/<page>.json`
- Navigation: `src/config/nav.ts`

## GitHub Pages preview
Every push to `main` runs `.github/workflows/pages.yml`, which builds with `BASE_PATH=/vidhi-transport-website/` (all links prefixed, every page `noindex`) and publishes to `https://krish-bhanushali.github.io/vidhi-transport-website/`. That preview is for review only; **never upload a preview build to public_html** — the committed `publish/` folder is always the production build (no base path, indexable).
