# Launch checklist (Search Console + post-launch monitoring)

## Before upload
- [ ] Owner has confirmed branch addresses/phones (`docs/integrations-and-owner-inputs.md`).
- [ ] Owner approved the privacy notice wording.
- [ ] `npm run build && npm run check` passes; committed `publish/` is the production build (pages say `index, follow`, not `noindex`).
- [ ] Full backup of current `public_html` downloaded.

## Upload day
- [ ] Contents of `publish/` uploaded to `public_html`.
- [ ] `.htaccess` redirects from `deploy/htaccess-redirects.txt` added; `/areas/dahej.html` → 301 → `/areas/transporter-in-dahej.html` confirmed with `curl -I`.
- [ ] `http://`, `https://vidhitransport.com` and `https://www.vidhitransport.com` all end on `https://www.vidhitransport.com/` with a single 301.
- [ ] Real LR number tracked on `/lr-track.html` from the production domain.
- [ ] WhatsApp + email handoff tested from a phone on `/contact_us.html`, `/pickup-request.html`, `/service-complaint.html`, `/inquiry.html`.
- [ ] 404 page shows for a random URL.

## Search Console (same day)
- [ ] Sitemap `https://www.vidhitransport.com/sitemap.xml` submitted; 55 URLs discovered.
- [ ] URL Inspection → Live test on `/`, `/services/part-truck-load.html`, `/branches/ankleshwar.html`, `/areas/transporter-in-dahej.html`, `/blog/ftl-vs-ptl-industrial-freight.html`: page fetched (not a bot-challenge page), canonical = user-declared, indexable.
- [ ] Request indexing for the 5 pages above and the 301 targets.
- [ ] Rich results test on a branch page (LocalBusiness, Breadcrumb) and an article (Article).

## Monitoring
- Week 1: Coverage/Pages report for spikes in "Not found (404)" or "Duplicate, Google chose different canonical"; fix and re-request.
- Weeks 1–4: Performance report — compare clicks/impressions for the 54 preserved URLs vs the previous 28 days; branch/area queries ("transporter in Vapi", "Dahej transport").
- Monthly: Core Web Vitals report (LCP ≤ 2.5 s, CLS ≤ 0.1, INP ≤ 200 ms); PageSpeed Insights on home, a service and a branch page.
- Monthly: Google Business Profiles NAP matches `branches.json`.
- Quarterly: publish at least one new practical article (topics in `docs/seo-gap-analysis.md`).
