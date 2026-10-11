# Vidhi Transport Co. — Static Website Redesign (2026)

Premium, accessible, SEO-oriented multi-page industrial logistics website. **No build pipeline. No server-side dependencies.** Final deployable files are standard HTML, CSS, JavaScript, SVG, XML and text.

## Architecture
- `index.html` — homepage.
- `services.html` + `services/*.html` — dedicated service landing pages (existing URL slugs retained).
- `branch-locator.html` + `locations/*.html` — 14 published locations and city-level pages.
- `insights.html` + `insights/*.html` — useful editorial content.
- Company, customer support, contact, careers, compliance and legal pages.
- `assets/site.css`, `assets/site.js` and `assets/favicon.svg` — shared static assets.
- `sitemap.xml`, `robots.txt` — crawler directives.

## Deploy anywhere
1. Download the `main` branch as a ZIP, or clone the repository.
2. Upload only the deployable HTML, CSS, JavaScript, SVG, XML and TXT files: root website documents plus the `assets/`, `services/`, `locations/` and `insights/` directories. The home document must be `index.html`.
3. Replace temporary wordmark/favicon with approved Vidhi logos.
4. Recheck all 14 branch addresses/numbers, any fleet totals, credentials, legal policies and operating hours.
5. Configure one canonical domain and permanent 301 redirects from any retired URLs.
6. Validate `robots.txt`, `sitemap.xml`, structured data and submit the sitemap to Google Search Console after deploying.

## GitHub Pages preview
The `main` branch contains an automated deploy workflow. Enable GitHub Pages under **Settings → Pages → Build and deployment → Source: GitHub Actions**. The intended preview address is `https://krish-bhanushali.github.io/vidhi-transport-website/` (after successful deployment). Relative asset/navigation links work under the `/vidhi-transport-website/` base path. Canonical tags intentionally point to the production domain and should only be used as the final canonical once the site goes live there.

## Contact form
No backend or lead storage. The contact form prepares a WhatsApp or mailto message; **the visitor must actually send it**. Connect a properly secured backend if lead capture or live LR tracking is needed.

## SEO and content
See `SEO-AUDIT.md`. The included XML sitemap uses the intended production domain. Content is an edited draft based on the public website; professional/legal verification is required before production launch.

## Automated quality checks
Every push to `main` runs `node scripts/check-site.mjs` through GitHub Actions to verify page metadata, canonical URLs, schema JSON, sitemap coverage and internal relative links. The Pages workflow prepares a clean `_site` artifact so that development documentation and workflows are not published.

## Accessibility
Semantic headings, keyboard focus styles, skip link, reduced-motion support, mobile navigation, aria live search status and native accordions.

© Vidhi Transport Co. All rights reserved. Replace brand assets with authorised files only.
