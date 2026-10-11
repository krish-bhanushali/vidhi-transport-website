# Integrations and owner inputs

## Integration status
| Integration | Status | Detail |
|---|---|---|
| **LR tracking** | ✅ Working (verified 11 Oct 2026) | Browser request to the existing ERP endpoint `https://vidhierp.in/service.aspx` (`control=getLRWebsite`, app `V01`, version `1`) — same call and same public identifiers the live site's `tracking.js` uses; no secret keys. CORS allowed the request from the test origin; an invalid LR returned HTTP 200 and the page showed the honest "No matching LR was found" state with a WhatsApp fallback. A real LR number should be tested once on the production domain. Config lives in `src/config/site.ts → tracking`. |
| **Quote / contact form** (`contact_us.html#quote`, homepage quick form) | ✅ Honest handoff | Validates fields, then opens WhatsApp (`wa.me/919825321589`) or a pre-filled email to customercare@vidhitransport.com, or copies the text. States shown: "prepared", "error". Never shows "submitted". |
| **Pickup request**, **service complaint** | ✅ Honest handoff | Same mechanism, same fields as live. |
| **Freight inquiry** (`inquiry.html`) | ⚠️ Changed | The live page embeds Google Form `1FAIpQLSdFkAUVWAK8TZXkM-nXbHUvYo0liFqx_WbNgfGcQvyl3C0Cwg`, which now returns **Google "Page not found"**. The rebuilt page uses the WhatsApp/email handoff instead. If you want a hosted form back, create a new Google Form (or Formspree/Tally etc.) and send the URL. |
| **Server-side form capture** | ⛔ Not available | A static host cannot store submissions. To get submissions into email/CRM automatically, provide an endpoint (e.g. Formspree, Google Apps Script web app, or a small PHP mailer on the existing hosting). Then only `src/scripts/forms.ts` needs a `fetch` branch. |
| Analytics / Search Console | Not installed | No tracking scripts are included. Provide a GA4 ID or Search Console verification tag if wanted. |
| Maps | Links only | "Map" links use Google Maps search for the exact address. No embedded maps (privacy + performance). The network map is an illustrative SVG with approximate positions. |

## Facts needing owner confirmation
| Item | Where it shows | Current wording |
|---|---|---|
| Branch addresses and phone numbers (14) | branch-locator, branches/, areas/, footer, schema | Copied exactly from live; please re-confirm each — they feed `LocalBusiness` schema. |
| Exact branch map coordinates | network map, schema geo | Approximate city-level coordinates; `geo` is **not** emitted in schema for that reason. Send Google Maps pins to add it. |
| ISO standard, certificate number, scope, validity; IBA approval reference | certifications.html | "ISO Certified — documented processes" (as on live). |
| "25+ years", "14 branches" | homepage stats, about | Taken from live site. |
| Fleet size, vehicle types owned vs. hired | not shown | Not published on live → not used. |
| Clients / case studies / testimonials | not shown | None exist on live → none added. |
| Transit times, rates | not shown | Never stated. |
| Article publication dates and author | blog/ | Taken from live (`Vidhi Transport Editorial Team`, Sept 2026). |
| Privacy notice | privacy.html | Drafted to describe actual website behaviour; marked "pending review". Needs legal review. |
| Social profile URLs | footer, schema `sameAs` | From live footer. |

## Missing assets
- Real photography of branches, loading/unloading, fleet, warehouse, people (only one real Vidhi truck photo exists; two images from Vidhi social posts are used and described as illustrative).
- Credential certificates (images/PDF) for the certifications page.
- Higher-resolution / SVG logo (current PNG is used; an SVG would be sharper).
