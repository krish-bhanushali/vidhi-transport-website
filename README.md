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
1. Download this branch as ZIP or clone the branch.
2. Upload **all files and directories** to your hosting web root. The home document must be `index.html`.
3. Replace temporary wordmark/favicon with approved Vidhi logos.
4. Recheck all 14 branch addresses/numbers, any fleet totals, credentials, legal policies and operating hours.
5. Configure one canonical domain and permanent 301 redirects from any retired URLs.
6. Validate `robots.txt`, `sitemap.xml`, structured data and submit the sitemap to Google Search Console after deploying.

## GitHub Pages preview
This branch is ready for branch-based static hosting. GitHub Pages must be activated under **Settings → Pages** by an account with repository administration permission. For a project Pages URL, relative asset/navigation links work under the `/vidhitransport/` base path. Canonical tags intentionally point to the production domain and should only be used as the final canonical once the site goes live there.

## Contact form
No backend or lead storage. The contact form prepares a WhatsApp or mailto message; **the visitor must actually send it**. Connect a properly secured backend if lead capture or live LR tracking is needed.

## SEO and content
See `SEO-AUDIT.md`. The included XML sitemap uses the intended production domain. Content is an edited draft based on the public website; professional/legal verification is required before production launch.

## Accessibility
Semantic headings, keyboard focus styles, skip link, reduced-motion support, mobile navigation, aria live search status and native accordions.

© Vidhi Transport Co. All rights reserved. Replace brand assets with authorised files only.
