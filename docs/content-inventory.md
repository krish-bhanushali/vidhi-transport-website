# Content inventory

Source: live crawl of https://www.vidhitransport.com (54 sitemap URLs, all HTTP 200, crawled 11 Oct 2026; files in `/workspace/live-crawl`). Extracted by `tools/import_live.py` + `tools/clean_data.py` into `src/data/`. Every page in the new site reads its copy from these data files.

## Company facts (src/config/site.ts)

| Fact | Value | Source |
|---|---|---|
| Trading name | Vidhi Transport Co. | logo, footer, schema on live |
| Customer care | +91 98253 21589 (call + WhatsApp) | live header/footer |
| Email | customercare@vidhitransport.com | live footer |
| Hours | Open daily, 8:00 AM–10:00 PM IST | live footer / contact |
| Head office | 803, 8th Floor, Haware Infotech, Near Inorbit Mall, Vashi, Navi Mumbai, Maharashtra 400703 | live contact + schema |
| Experience | 25+ years | live home + about |
| Branches | 14 listed (9 Gujarat, 5 Maharashtra) | live branch locator |
| Credentials | Go Green, IBA Approved, ISO Certified (standard number not published) | live certifications.html |
| Social | LinkedIn, Facebook, Instagram | live footer |

Not published on the live site and therefore **not used**: fleet size, client names/logos, tonnage, ratings/reviews, transit times, rates, ISO standard/certificate number, GSTIN/CIN.

## Branches (src/data/branches.json)

| Branch | State | Address | Phone(s) | Branch page | Area page |
|---|---|---|---|---|---|
| Dahej Branch | Gujarat | IPCL Main Road, Near Krishna Service Station, New Wadia Road, Dahej, Bharuch, Gujarat 392130 | +91 99789 77263 | /branches/dahej.html | /areas/transporter-in-dahej.html |
| Ankleshwar Branch | Gujarat | Plot No. 2006/18, Near Asian Paints Chokdi, Ankleshwar, Gujarat 393002 | +91 63598 93342 | /branches/ankleshwar.html | /areas/transporter-in-ankleshwar.html |
| Sachin (Surat) Branch | Gujarat | Plot No. 2, Godown No. 3, Near Ambica Weighbridge, Sachin–Palsana Road, Surat, Gujarat 394220 | +91 94263 90748 | — | /areas/transporter-in-sachin-surat.html |
| Panoli Branch | Gujarat | L-913/3, Ganesh Nand Chowkdi, Panoli, Gujarat 393002 | +91 63598 93342 | — | /areas/transporter-in-panoli.html |
| Vapi Branch | Gujarat | Gala No. 1, Industrial Plot No. 901/1/10, 3rd Phase, Shree Shyam Complex, GIDC Area, Vapi, Gujarat 396195 | +91 63598 93351, +91 63598 93340 | /branches/vapi.html | /areas/transporter-in-vapi.html |
| Sarigam and Umergaon Branch | Gujarat | Shop No. 1, Plot No. 2/3, Nandham Palgham, Umergam–Sanjan Road, Umbergam, Gujarat 396171 | +91 93774 47457, +91 63598 93350 | — | /areas/transporter-in-sarigam-umergam.html |
| Vadodara Branch | Gujarat | Survey No. 761, Godown No. 4/3, Opp. GSFC, Fertilizer Nagar, Vadodara, Gujarat 390010 | +91 63598 93349 | /branches/vadodara.html | /areas/transporter-in-vadodara.html |
| Nandesari GIDC Branch | Gujarat | Chamunda Nagar, Nandesari Front, Gujarat Dyestuff, Behind Dhanlaxmi Kata, Nandesari, Vadodara, Gujarat 391340 | +91 63598 93307 | — | /areas/transporter-in-nandesari.html |
| Ahmedabad Branch | Gujarat | Ambica Estate, NH 8, Aslali, Ahmedabad, Gujarat 382427 | +91 63598 93347 | /branches/ahmedabad.html | /areas/transporter-in-ahmedabad.html |
| Bhiwandi Branch | Maharashtra | Gala No. 1, New Madhvi Compound, Near Narayan Talpatriwala, Anjur Road, Anjur Phata, Bhiwandi, Maharashtra 421302 | +91 63598 93366 | /branches/bhiwandi.html | /areas/transporter-in-bhiwandi.html |
| Navi Mumbai Branch and Head Office | Maharashtra | 803, 8th Floor, Haware Infotech, Near Inorbit Mall, Vashi, Navi Mumbai, Maharashtra 400703 | +91 93775 55777 | /branches/navi-mumbai.html | /areas/transporter-in-navi-mumbai.html |
| Rabale MIDC Branch | Maharashtra | SS-397, Near Gaon Devi Mandir, Behind Mohit Hotel, MIDC, Rabale, Navi Mumbai, Maharashtra 400701 | +91 63598 93358 | /branches/rabale.html | /areas/transporter-in-rabale.html |
| Tarapur Branch | Maharashtra | Vaibhav Paradise, Plot No. RC-21, Shop No. 3, Next to T.V.M. School, Opp. Bombay Rayon, MIDC, Tarapur, Boisar, Maharashtra 401506 | +91 63598 93355 | — | /areas/transporter-in-tarapur-boisar.html |
| Vasai Branch | Maharashtra | Gala No. 4, Opp. Hanuman Mandir, Sativali Naka, Sativali, NH Highway, Vasai East, Maharashtra 401208 | +91 63598 93369 | — | /areas/transporter-in-vasai.html |

Service-area tags per branch are preserved exactly and labelled on every page as coverage references, not separate offices.

## Services (src/data/services.json)

| URL | H1 | FAQ count |
|---|---|---|
| /services/full-truck-load.html | Full Truckload Transport | 4 |
| /services/part-truck-load.html | Part Load Transport | 4 |
| /services/reverse-logistics.html | Reverse Logistics | 4 |
| /services/chemical-industrial-freight.html | Chemical & Industrial Freight | 4 |
| /services/first-mile-last-mile.html | First-Mile & Last-Mile Support | 4 |
| /services/project-cargo.html | Project Cargo Transport | 4 |
| /services/odc-construction-cargo.html | ODC & Construction Cargo | 4 |
| /services/port-container-transport.html | Container Transport to Ports | 4 |
| /services/warehousing.html | Warehousing & Distribution | 4 |

Billing options (Freight Paid, Freight To Pay, Account / Contract Billing) and delivery arrangements (Door to Door, Godown to Door, Godown to Godown, DACC, COD) are taken verbatim from the live services hub.

## Articles (src/data/articles.json)

| URL | Title | Published | Author |
|---|---|---|---|
| /blog/ftl-vs-ptl-industrial-freight.html | FTL vs PTL: How to Choose for an Industrial Dispatch | 2026-09-07 | Vidhi Transport Editorial Team |
| /blog/drum-carboy-transport-checklist.html | Drum and Carboy Transport: A Dispatch-Planning Checklist | 2026-09-07 | Vidhi Transport Editorial Team |
| /blog/gujarat-maharashtra-dispatch-checklist.html | Gujarat–Maharashtra Industrial Dispatch Checklist | 2026-09-07 | Vidhi Transport Editorial Team |

## Corporate / support pages (src/data/pages/*.json)

- `Clientele.json` → **Freight built around the realities of your industry.** (2 sections, 0 FAQs)
- `about-us.json` → **Built around the industrial corridors we know.** (7 sections, 4 FAQs)
- `branch-locator.json` → **Local teams along important industrial corridors.** (4 sections, 4 FAQs)
- `branches__ahmedabad.json` → **Ahmedabad transport branch.** (1 sections, 0 FAQs)
- `branches__ankleshwar.json` → **Ankleshwar transport branch.** (1 sections, 0 FAQs)
- `branches__bhiwandi.json` → **Bhiwandi transport branch.** (1 sections, 0 FAQs)
- `branches__dahej.json` → **Dahej transport branch.** (1 sections, 0 FAQs)
- `branches__navi-mumbai.json` → **Navi Mumbai Head Office transport branch.** (1 sections, 0 FAQs)
- `branches__rabale.json` → **Rabale transport branch.** (1 sections, 0 FAQs)
- `branches__vadodara.json` → **Vadodara transport branch.** (1 sections, 0 FAQs)
- `branches__vapi.json` → **Vapi transport branch.** (1 sections, 0 FAQs)
- `careers.json` → **Build a career where every day keeps industry moving.** (6 sections, 4 FAQs)
- `certifications.json` → **Three credentials presented with the right context.** (2 sections, 0 FAQs)
- `contact_us.json` → **Give the team enough detail to give you a useful answer.** (3 sections, 4 FAQs)
- `content.json` → **Useful road-freight guidance for dispatch teams.** (2 sections, 0 FAQs)
- `csr.json` → **Responsibility belongs in everyday logistics decisions.** (5 sections, 4 FAQs)
- `governance.json` → **Clear responsibilities build dependable business relationships.** (5 sections, 4 FAQs)
- `group-companies.json` → **One confirmed operating identity, clearly presented.** (4 sections, 4 FAQs)
- `help-desk.json` → **The right help, without searching the whole website.** (3 sections, 4 FAQs)
- `index.json` → **Chemical and industrial freight. Delivered with certainty.** (7 sections, 8 FAQs)
- `inquiry.json` → **Give us the details behind the movement.** (4 sections, 4 FAQs)
- `lr-track.json` → **Track with your LR number.** (2 sections, 5 FAQs)
- `our-infrastructure.json` → **Infrastructure is the system behind every dispatch.** (5 sections, 4 FAQs)
- `pickup-request.json` → **Tell us what is ready, where and when.** (2 sections, 3 FAQs)
- `service-complaint.json` → **Register the issue with the shipment reference.** (2 sections, 4 FAQs)
- `services.json` → **The right movement for every industrial dispatch.** (3 sections, 0 FAQs)
- `tax-forms.json` → **Prepare the documents before the vehicle moves.** (3 sections, 4 FAQs)
- `tools.json` → **Start the right logistics task in one click.** (3 sections, 0 FAQs)

## Media

| File | Origin | Use |
|---|---|---|
| src/assets/images/vidhi-truck-highway.jpg | live site `/assets/images/hero-fleet.jpg` (Vidhi-branded container truck) | homepage hero, FTL tile, OG image |
| src/assets/images/fleet-yard.jpg | Vidhi social post image (`/workspace/vidhi/vidhi-2026-10-06.jpg`), unbranded, marked "illustrative" in alt text | infrastructure / corporate bands |
| src/assets/images/loading-dock.jpg | Vidhi social post image (`/workspace/vidhi/vidhi-engineering-packaging-2026-10-05.jpg`), unbranded, illustrative | PTL tile, image bands |
| vidhi-logo.png / vidhi-logo-light.png | live site logo | header / footer |
| badges/*.svg | live site credential badges | credential strip |

All photos are converted to responsive WebP at build time by Astro (`astro:assets`) with width/height and lazy loading below the fold.
