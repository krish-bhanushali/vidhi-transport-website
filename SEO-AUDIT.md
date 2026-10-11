# SEO review and launch checklist (11 October 2026)

## Source audit limits
The existing production site already exposes crawlable content for service pages and a detailed, crawlable 14-branch directory. This is **not** a claim that those assets were missing. Search-engine crawling shows indexed-style URLs including `/services/full-truck-load.html`, `/services/part-truck-load.html`, `/about-us.html`, `/services.html` and `/branch-locator.html`.

A technical crawl with site-wide HTTP status codes, Core Web Vitals, full response headers and Search Console access was not available. Live `robots.txt` and `sitemap.xml` could not be verified through the available public extraction tool; do not label them as missing without a real HTTP check.

## Observed content and consistency risks
- Homepage text lists '24/7 support' while published customer-care hours are 8:00 AM–10:00 PM IST. This redesign uses published customer-care hours and avoids an unsupported 24/7 customer-care promise.
- The live homepage displays a count of 150 owned vehicles. Confirm fleet ownership, current figures and documentation before reusing a number; the redesign intentionally avoids that claim.
- Claims including IBA Approved, ISO Certified and Go Green must use exact documentation, approval numbers, scope and validity before marketing them as current.
- Existing branch directory covers 14 offices, and these have been included as dedicated readable HTML pages; review phone/address changes.

## Implemented in this branch
- One relevant title, meta description, H1 and canonical on every public page.
- Static HTML text discoverable without JavaScript; service pages and branch pages have unique descriptive content.
- Organization/WebPage, Service, LocalBusiness and Article structured data where applicable; validate results before launch.
- Descriptive internal links, logical nav/footer paths, breadcrumb display, FAQ text, alt/ARIA for diagrams and responsive layout.
- XML sitemap, robots.txt, accessible navigation, keyboard handling, reduced motion.
- Lightweight CSS/JS only; no hydration or bulky JavaScript frameworks.
- Relative URL assets and navigation allow GitHub project Pages preview and standard shared hosting.
- SEO-oriented editorial content based on useful procurement and dispatch search intent.

## Production tasks requiring access or approval
1. Crawl production with Screaming Frog or equivalent; export 3xx/4xx/5xx, canonicals, duplicate descriptions, orphan pages and page depth.
2. Compare old vs new URL inventory and **301 redirect** any retired legacy pages. GitHub Pages cannot configure HTTP 301 rules; implement on actual hosting/CDN.
3. Run Lighthouse/PageSpeed Insights on deployed pages; tune fonts/assets and confirm CWV performance.
4. Verify live robots, sitemap XML content type, Search Console ownership and canonical host behaviour (www vs non-www).
5. Obtain approved logo, brand photos, certificate details, social-profile URLs, proper OG image, privacy policy and contact form handling policy.
6. Verify all 14 branch details; update if changed.
7. Consider verifying individual Business Profile pages and local citations for branches with independent staffed offices.
8. Connect a legitimate LR tracking endpoint if available; current page deliberately provides support actions rather than fake live tracking.
9. Confirm business entity naming, phone and operating hours across page, structured data and business directories.
10. Only after launch, monitor Google Search Console for crawl errors, ranking and page indexing.
