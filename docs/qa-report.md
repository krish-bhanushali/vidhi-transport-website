# QA report and page-by-page status

Run date: 11 Oct 2026 (IST). Everything below was run against the **built `publish/` folder served by `python3 -m http.server 4175`** (a plain static server, no Node at runtime).

## Release gate (spec section 15)
| Check | Result | How |
|---|---|---|
| Complete static `publish/` (.html/.css/.js/media) | ✅ 56 HTML pages, 1 CSS, 3 small JS files (≈5.5 KB gzip total), WebP images, woff2 fonts | `npm run build` |
| No server runtime needed | ✅ | served by python http.server only |
| Homepage from index.html; every deep page loads directly | ✅ all 56 paths HTTP 200 | `scripts/overflow.mjs` loads every page |
| Main text in HTML before JS | ✅ every page ≥ 800 chars of `<main>` text; Chromium with JS disabled shows H1 and all copy visible | `npm run check` + JS-off Playwright run |
| Navigation without hydration | ✅ plain links; desktop mega-menu opens on hover/focus with CSS fallback; footer carries the full site map (mobile menu toggle needs JS, footer links do not) | manual |
| Deployment-safe asset paths | ✅ root-relative; preview build with `BASE_PATH` also passes all link checks | `BASE_PATH=/vidhi-transport-website/ npm run check` |
| Existing URLs preserved | ✅ all 54 live sitemap URLs exist at identical paths (incl. `Clientele.html`, `contact_us.html`) | `npm run check` (scripts/live-urls.txt) |
| Old 404 URLs mapped | ✅ 5 × 301 in `deploy/htaccess-redirects.txt` | |
| No missing images/CSS/fonts/JS | ✅ 10,528 local references resolved; no 4xx in browser network logs | `npm run check`, `overflow.mjs` |
| Real integrations / honest fallbacks | ✅ LR tracking hits real ERP; forms are WhatsApp/email handoffs; dead Google Form documented | `docs/integrations-and-owner-inputs.md` |
| No fake submissions / sample LR data | ✅ | code review of `forms.ts`, `tracking.ts` |
| Titles, descriptions, canonicals, sitemap, robots, JSON-LD | ✅ unique per page, self canonical, 55-URL sitemap, valid JSON-LD on every page | `npm run check` |
| Header/footer/service/branch/CTA links work | ✅ (all internal hrefs + in-page anchors resolved) | `npm run check` |
| Mobile, keyboard, contrast, reduced motion, focus | ✅ Lighthouse accessibility 100 on 10 representative pages; reduced-motion disables all animation; visible focus rings | Lighthouse 12 |
| No console errors / overflow | ✅ 0 console errors; 0 px horizontal overflow at 320, 375, 390, 768, 1440, 1920 on all 56 pages (430/1024 also checked earlier) | `scripts/overflow.mjs` |
| Deployment guide | ✅ `docs/deployment-guide.md` | |
| Screenshots desktop + mobile | ✅ `qa-screenshots/` (not committed) | `scripts/screens.mjs` |

## Lighthouse (desktop-class box, local server, mobile emulation default)
| Page | Perf | A11y | Best practices | SEO | LCP | CLS | TBT |
|---|---|---|---|---|---|---|---|
| / | 95 | 100 | 100 | 100 | 2.6 s | 0 | 110 ms |
| /services.html | 97 | 100 | 100 | 100 | 2.4 s | 0 | 80 ms |
| /services/part-truck-load.html | 97 | 100 | 100 | 100 | 2.5 s | 0 | 0 ms |
| /branch-locator.html | 97 | 100 | 100 | 100 | 2.3 s | 0 | 100 ms |
| /branches/dahej.html | 98 | 100 | 100 | 100 | 2.0 s | 0 | 100 ms |
| /areas/transporter-in-vapi.html | 99 | 100 | 100 | 100 | 2.0 s | 0 | 0 ms |
| /about-us.html | 99 | 100 | 100 | 100 | 2.2 s | 0 | 0 ms |
| /contact_us.html | 98 | 100 | 100 | 100 | 2.0 s | 0 | 100 ms |
| /lr-track.html | 99 | 100 | 100 | 100 | 2.0 s | 0 | 0 ms |
| /blog/ftl-vs-ptl-industrial-freight.html | 98 | 100 | 100 | 100 | 2.0 s | 0 | 100 ms |

Local numbers; re-run PageSpeed Insights on the production host (real network, Cloudflare caching) after launch. Remaining suggestions: long cache TTL headers (host config) and ~25 KB unused CSS per page (single shared stylesheet, accepted for simplicity).

## Screenshots
`qa-screenshots/` — 1440 px and 390 px full-page captures of: home, services/chemical-industrial-freight, branches/dahej, areas/transporter-in-ankleshwar, about-us, Clientele (industries), contact_us, blog/ftl-vs-ptl-industrial-freight, branch-locator, lr-track, content.

## Known limitations
- Mobile menu requires JavaScript (all destinations remain reachable from the footer with JS off).
- Network map positions are approximate and labelled illustrative.
- Two of three photos are illustrative images from Vidhi's social posts; real photography is an owner input.

## Page-by-page status
| URL | Template | H1 | Status |
|---|---|---|---|
| / | Homepage | Chemical and industrial freight. Delivered with certainty. | Shipped, tested |
| /404.html | Error | This page has moved or no longer exists. | Shipped (noindex); needs ErrorDocument on host |
| /Clientele.html | Corporate / support page | Freight built around the realities of your industry. | Shipped, tested |
| /about-us.html | Corporate / support page | Built around the industrial corridors we know. | Shipped, tested |
| /branch-locator.html | Branch locator | Local teams along important industrial corridors. | Shipped, tested — owner to re-confirm NAP |
| /careers.html | Corporate / support page | Build a career where every day keeps industry moving. | Shipped, tested |
| /certifications.html | Corporate / support page | Three credentials presented with the right context. | Shipped, tested — certificate details pending owner |
| /contact_us.html | Contact + quote form | Give the team enough detail to give you a useful answer. | Shipped, tested |
| /content.html | Insights hub | Useful road-freight guidance for dispatch teams. | Shipped, tested |
| /csr.html | Corporate / support page | Responsibility belongs in everyday logistics decisions. | Shipped, tested |
| /governance.html | Corporate / support page | Clear responsibilities build dependable business relationships. | Shipped, tested |
| /group-companies.html | Corporate / support page | One confirmed operating identity, clearly presented. | Shipped, tested |
| /help-desk.html | Corporate / support page | The right help, without searching the whole website. | Shipped, tested |
| /inquiry.html | Inquiry form | Give us the details behind the movement. | Shipped, tested — live Google Form is dead; WhatsApp/email handoff used |
| /lr-track.html | LR tracking tool | Track with your LR number. | Shipped, tested against real ERP (not-found path); real LR test pending on production |
| /our-infrastructure.html | Corporate / support page | Infrastructure is the system behind every dispatch. | Shipped, tested |
| /pickup-request.html | Pickup form | Tell us what is ready, where and when. | Shipped, tested |
| /privacy.html | Legal | Website privacy notice | Shipped, tested — pending owner legal review |
| /service-complaint.html | Complaint form | Register the issue with the shipment reference. | Shipped, tested |
| /services.html | Services hub | The right movement for every industrial dispatch. | Shipped, tested |
| /tax-forms.html | Corporate / support page | Prepare the documents before the vehicle moves. | Shipped, tested |
| /tools.html | Corporate / support page | Start the right logistics task in one click. | Shipped, tested |
| /areas/transporter-in-ahmedabad.html | Area / local route guide | Industrial transporter in Ahmedabad | Shipped, tested — owner to re-confirm NAP |
| /areas/transporter-in-ankleshwar.html | Area / local route guide | Industrial transporter in Ankleshwar | Shipped, tested — owner to re-confirm NAP |
| /areas/transporter-in-bhiwandi.html | Area / local route guide | Industrial transporter in Bhiwandi | Shipped, tested — owner to re-confirm NAP |
| /areas/transporter-in-dahej.html | Area / local route guide | Industrial transporter in Dahej | Shipped, tested — owner to re-confirm NAP |
| /areas/transporter-in-nandesari.html | Area / local route guide | Industrial transporter in Nandesari | Shipped, tested — owner to re-confirm NAP |
| /areas/transporter-in-navi-mumbai.html | Area / local route guide | Industrial transporter in Navi Mumbai | Shipped, tested — owner to re-confirm NAP |
| /areas/transporter-in-panoli.html | Area / local route guide | Industrial transporter in Panoli | Shipped, tested — owner to re-confirm NAP |
| /areas/transporter-in-rabale.html | Area / local route guide | Industrial transporter in Rabale | Shipped, tested — owner to re-confirm NAP |
| /areas/transporter-in-sachin-surat.html | Area / local route guide | Industrial transporter in Sachin and Surat | Shipped, tested — owner to re-confirm NAP |
| /areas/transporter-in-sarigam-umergam.html | Area / local route guide | Industrial transporter in Sarigam and Umergaon | Shipped, tested — owner to re-confirm NAP |
| /areas/transporter-in-tarapur-boisar.html | Area / local route guide | Industrial transporter in Tarapur and Boisar | Shipped, tested — owner to re-confirm NAP |
| /areas/transporter-in-vadodara.html | Area / local route guide | Industrial transporter in Vadodara | Shipped, tested — owner to re-confirm NAP |
| /areas/transporter-in-vapi.html | Area / local route guide | Industrial transporter in Vapi | Shipped, tested — owner to re-confirm NAP |
| /areas/transporter-in-vasai.html | Area / local route guide | Industrial transporter in Vasai | Shipped, tested — owner to re-confirm NAP |
| /blog/drum-carboy-transport-checklist.html | Article | Drum and Carboy Transport: A Dispatch-Planning Checklist | Shipped, tested |
| /blog/ftl-vs-ptl-industrial-freight.html | Article | FTL vs PTL: How to Choose for an Industrial Dispatch | Shipped, tested |
| /blog/gujarat-maharashtra-dispatch-checklist.html | Article | Gujarat–Maharashtra Industrial Dispatch Checklist | Shipped, tested |
| /branches/ahmedabad.html | Branch detail | Ahmedabad transport branch. | Shipped, tested — owner to re-confirm NAP |
| /branches/ankleshwar.html | Branch detail | Ankleshwar transport branch. | Shipped, tested — owner to re-confirm NAP |
| /branches/bhiwandi.html | Branch detail | Bhiwandi transport branch. | Shipped, tested — owner to re-confirm NAP |
| /branches/dahej.html | Branch detail | Dahej transport branch. | Shipped, tested — owner to re-confirm NAP |
| /branches/navi-mumbai.html | Branch detail | Navi Mumbai Head Office transport branch. | Shipped, tested — owner to re-confirm NAP |
| /branches/rabale.html | Branch detail | Rabale transport branch. | Shipped, tested — owner to re-confirm NAP |
| /branches/vadodara.html | Branch detail | Vadodara transport branch. | Shipped, tested — owner to re-confirm NAP |
| /branches/vapi.html | Branch detail | Vapi transport branch. | Shipped, tested — owner to re-confirm NAP |
| /services/chemical-industrial-freight.html | Service detail | Chemical & Industrial Freight | Shipped, tested |
| /services/first-mile-last-mile.html | Service detail | First-Mile & Last-Mile Support | Shipped, tested |
| /services/full-truck-load.html | Service detail | Full Truckload Transport | Shipped, tested |
| /services/odc-construction-cargo.html | Service detail | ODC & Construction Cargo | Shipped, tested |
| /services/part-truck-load.html | Service detail | Part Load Transport | Shipped, tested |
| /services/port-container-transport.html | Service detail | Container Transport to Ports | Shipped, tested |
| /services/project-cargo.html | Service detail | Project Cargo Transport | Shipped, tested |
| /services/reverse-logistics.html | Service detail | Reverse Logistics | Shipped, tested |
| /services/warehousing.html | Service detail | Warehousing & Distribution | Shipped, tested |
