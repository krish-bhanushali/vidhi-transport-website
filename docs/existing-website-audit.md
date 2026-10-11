# Existing website audit — www.vidhitransport.com

**Crawled:** 11 October 2026 (IST) with curl from the build box, sitemap-driven, plus earlier captures from 27 Sep 2026 (`/workspace/seo-audit-vidhi/NOTES.md`). Raw HTML for all 54 URLs is stored in `/workspace/live-crawl/pages/`; structured extraction in `/workspace/live-crawl/pages.json`.

## Host and crawl behaviour
- HTTPS on `www.vidhitransport.com`; canonical tags on live pages point to `https://www.vidhitransport.com/...`.
- A Cloudflare-style "One moment, please…" interstitial is served to some non-browser clients (it is what the copy in `seo-audit-vidhi/sitemap.xml` actually contains). Googlebot access was not tested; the owner should confirm in Search Console (URL Inspection) that the bot challenge is not served to search engines.
- `robots.txt`: `User-agent: * / Allow: /` with AI crawlers allowed and `Sitemap: https://www.vidhitransport.com/sitemap.xml`.
- `sitemap.xml`: 54 URLs, all returned HTTP 200.
- Apex `vidhitransport.com` answered 200 without a redirect in the September check → potential duplicate host. See deployment guide (host canonicalisation).

## URL inventory (54, all preserved 1:1 in the rebuild)
| Group | Count | URLs |
|---|---|---|
| Core | 1 | `/` |
| Corporate | 9 | about-us, our-infrastructure, certifications, careers, csr, governance, group-companies, Clientele (capital C — industries page), content (insights hub) |
| Services | 10 | services.html + 9 under `/services/` (full-truck-load, part-truck-load, reverse-logistics, chemical-industrial-freight, first-mile-last-mile, project-cargo, odc-construction-cargo, port-container-transport, warehousing) |
| Network | 23 | branch-locator.html, 8 `/branches/*.html` (ahmedabad, ankleshwar, bhiwandi, dahej, navi-mumbai, rabale, vadodara, vapi), 14 `/areas/transporter-in-*.html` |
| Tools | 8 | tools, lr-track, pickup-request, inquiry, contact_us, help-desk, service-complaint, tax-forms |
| Articles | 3 | `/blog/ftl-vs-ptl-industrial-freight.html`, `/blog/drum-carboy-transport-checklist.html`, `/blog/gujarat-maharashtra-dispatch-checklist.html` |

Full per-URL detail (live title, new title, template, action) is in `docs/url-migration-map.csv`; metadata in `docs/seo-page-matrix.csv`.

## Known 404s that still attract search traffic
`/credentials.html`, `/areas/ankleshwar.html`, `/areas/dahej.html` (still ranked #1 for "Transporter in Dahej" in Sept), `/areas/vapi.html`, `/services/part-load.html`. Redirects prepared in `deploy/htaccess-redirects.txt`.

## Navigation and footer (live)
Header: Home, Services (mega list of 9), Branches, Industries (Clientele.html), Company (about, infrastructure, certifications, careers, CSR, governance, group companies), Insights, Tools; utility actions Track LR + Get quote; phone + email in footer with 14 branches.

## Live functionality
| Feature | How it works on live | Status in rebuild |
|---|---|---|
| LR tracking | Browser `fetch` to `https://vidhierp.in/service.aspx` (control `getLRWebsite`, public app/device identifiers in `assets/js/tracking.js`) | Ported to `src/scripts/tracking.ts`; tested against the real ERP (HTTP 200, honest "No matching LR" state for an invalid LR). |
| Quote / contact form | Client-side; builds a WhatsApp or mailto message (`assets/js/forms.js`) | Same honest handoff, with validation + consent; no fake "submitted" state. |
| Pickup request, service complaint | Same WhatsApp/email handoff | Preserved with identical fields. |
| Freight inquiry | Embeds a Google Form | **The Google Form returns "Page not found" (checked 11 Oct 2026).** Replaced with the WhatsApp/email handoff; owner to supply a new form if wanted. |
| Branch filter | Client-side filter | Preserved; all branch text is in HTML when JS is off. |

## Content quality notes
- Strong, specific corridor positioning (GIDC/MIDC, Gujarat ↔ Maharashtra, packaged chemicals, PTL/FTL).
- Branch pages are short (≈250–300 words) and share a template; area pages carry most of the local detail. Kept as-is factually; layout now links branch ↔ area ↔ corridor.
- Live H1s, FAQs, titles and descriptions were already well optimised; the rebuild keeps them (see SEO gap analysis for remaining gaps).
- Certifications page deliberately avoids naming an ISO standard; kept that way.
- No client logos, testimonials, fleet counts or rates exist on the live site; none were added.

## Old GitHub repository (tag `pre-redesign-backup`)
The repo previously held a different static draft (with `/locations/`, `/insights/`, `industries.html`, `credentials.html`, `terms.html` …) deployed only to GitHub Pages. Those URLs never existed on www.vidhitransport.com; they are listed in the migration map for completeness. The full previous state is recoverable with `git checkout pre-redesign-backup`.
