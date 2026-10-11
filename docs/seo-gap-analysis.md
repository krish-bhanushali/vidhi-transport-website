# SEO gap analysis

Baseline: live site crawl (11 Oct 2026) + SERP spot checks from 27 Sep 2026 (`/workspace/seo-audit-vidhi/NOTES.md`, WebSearch order, not Search Console data). Search volumes were **not** measured; themes below are candidates to validate in Search Console / Keyword Planner.

## What the rebuild fixes or preserves
| Area | Live site | Rebuild |
|---|---|---|
| URL equity | 54 URLs, indexed | All 54 kept byte-for-byte (case, `.html`). 5 legacy 404s mapped to 301s (`deploy/htaccess-redirects.txt`). |
| Titles / descriptions | Good, unique | Kept from live; checked unique by `npm run check`; lengths in `seo-page-matrix.csv`. |
| H1 | One per page | One per page, enforced by the release-gate script. |
| Canonical | Self-referencing | Self-referencing absolute `https://www.vidhitransport.com/...` on every page (staging builds add `noindex`). |
| Structured data | Organization + page-level | `@graph` per page: Organization (+ContactPoint, hours), WebSite, WebPage/CollectionPage/ContactPage, BreadcrumbList; `Service` on service pages; `LocalBusiness` (MovingCompany subtype not used—kept generic) for each of the 14 verified branches, placed once per branch (on the branch page where one exists, otherwise its area page); `Article` on the 3 articles; `ItemList` on hubs. No ratings/reviews. FAQ content is visible on page but no `FAQPage` markup (Google no longer shows FAQ rich results for commercial sites; avoids over-claiming eligibility). |
| Sitemap / robots | 54 URLs | 55 URLs (adds `/privacy.html`), generated from built canonicals with `lastmod`; robots points to it. |
| Content without JS | Yes | Yes — verified with JavaScript disabled in Chromium. |
| Performance | Unmeasured | One CSS file, ~small deferred JS, WebP images with dimensions, self-hosted preloaded fonts. Run Lighthouse on the live host after upload. |
| Internal links | Basic | Service ↔ branch, branch ↔ area, area ↔ corridor area pages, article → service, every page → quote. Footer links all 14 locations. |
| Mobile | OK | No horizontal overflow at 320–1920 px on all 56 pages (scripted check). |

## Remaining gaps (by priority)
| # | Gap | Evidence | Recommendation | Needs owner? |
|---|---|---|---|---|
| 1 | Legacy area URLs still in Google but 404 (`/areas/dahej.html`, `/areas/vapi.html` …) | SERP checks Sept 2026 | Add the 301s in `deploy/htaccess-redirects.txt`, then request recrawl in Search Console. | Yes (hosting access) |
| 2 | Apex/www duplicate host | Apex answered 200 in Sept check | Force `https://www.` with one 301 at host level. | Yes |
| 3 | Bot interstitial (Cloudflare "One moment, please…") | Seen by curl | Confirm Googlebot is not challenged (URL Inspection → live test). | Yes |
| 4 | "transporter in Ankleshwar", "chemical transport Ankleshwar", "chemical transport Gujarat" — not top 5 | SERP checks | Area/branch pages now richer in layout but copy is unchanged; owner-approved local specifics (GIDC estates served, typical cargo, loading constraints) would differentiate. No doorway pages created. | Yes (facts) |
| 5 | Thin branch pages (~280 words) | Word count | Add a branch photo, branch manager/desk name, real landmarks and directions; each branch page should have something the area page doesn't. | Yes |
| 6 | No industry pages | Live has a single `/Clientele.html` | Build individual industry pages (chemicals, pharma, engineering, packaging) **only** with owner-confirmed capability and examples. Not created now to avoid thin pages. | Yes |
| 7 | Lane guides (Ankleshwar–Bhiwandi, Dahej–Navi Mumbai, Vapi–Mumbai) | Spec §6 | Worth writing once the owner confirms the lanes are run regularly and what is distinctive (documents, timing windows—no transit promises). | Yes |
| 8 | Freshness | 3 articles | Topic queue: e-way bill preparation checklist; industrial packaging for road freight; load consolidation; reverse logistics for drums/IBCs; choosing an industrial transporter. | Editorial |
| 9 | Credentials proof | ISO standard not stated | Publish certificate number/scope/validity and IBA reference (image or PDF) to strengthen E-E-A-T. | Yes |
| 10 | Google Business Profiles | Not audited | Ensure each of the 14 branches has a verified GBP with the same NAP as `branches.json`; link GBP → branch/area page. | Yes |
| 11 | Real photography | 1 real fleet photo; 2 illustrative | Commission photos of branches, loading, fleet. Update `src/assets/images`. | Yes |

## Keyword themes → target pages
See `docs/seo-page-matrix.csv` (columns: keyword_theme, search_intent, priority, title, description, H1, internal links, verification needs). Priority P1 = commercial/local money pages; P2 = specialised services; P3 = informational/trust.
