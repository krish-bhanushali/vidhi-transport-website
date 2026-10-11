# Architecture and design system

## Stack
- **Astro 5, static output** (`output: 'static'`, `build.format: 'file'`) → every page is a real `.html` file at the same path as the live site. TypeScript throughout; zero client framework.
- Plain CSS with design tokens (`src/styles/global.css`); one stylesheet, one small JS bundle (`src/scripts/main.ts`) plus page-specific `forms.ts` and `tracking.ts`.
- Self-hosted variable fonts (Manrope for display, Inter for text; latin subset, `font-display: swap`, preloaded).
- Images via `astro:assets` → responsive WebP with width/height; hero eager + `fetchpriority=high`, everything else lazy.
- Output folder: `publish/` (upload its contents to `public_html`). `scripts/postbuild.mjs` writes `sitemap.xml`, `robots.txt`, `.nojekyll`.

## Source layout
```
src/config/site.ts      verified company facts (phone, email, hours, head office, credentials, ERP config)
src/config/nav.ts       mega-menu + footer structure
src/config/forms.ts     form field definitions (quote, pickup, complaint, quick)
src/data/*.json         branches, services, articles, and pages/*.json (one per live page) — imported from the live site
src/lib/data.ts         typed loaders, branch geo (approximate, for the illustrative map only)
src/lib/schema.ts       JSON-LD builders (Organization, WebSite, WebPage, BreadcrumbList, Service, LocalBusiness, Article)
src/layouts/Base.astro  head/meta/OG/canonical/schema, header, footer, skip link
src/components/         Header, Footer, PageHero, GenericSections, NetworkMap, BranchCard, EnquiryForm, TrackForm, FaqList, CtaBand, CredStrip, OptionsGrid, PatternArt, Icon, Breadcrumbs
src/pages/              index, services, services/[slug], branch-locator, branches/[slug], areas/[slug], content, blog/[slug], contact_us, inquiry, pickup-request, service-complaint, lr-track, privacy, 404, [page] (all other corporate/support pages)
tools/                  import_live.py, clean_data.py (re-import live content), make_docs.py (CSV reports)
scripts/                postbuild.mjs, check-site.mjs (release gate), overflow.mjs, screens.mjs (Playwright QA)
```

## Design language
Inspired by large-group corporate sites such as Godrej Industries (restrained editorial layout, oversized confident headlines, generous whitespace, full-bleed image bands, mega-menu, quiet footer). No assets or copy were taken from them.

| Token | Value |
|---|---|
| Brand red | `#ED3A32` (`--brand-red`); darker `--brand-red-text` `#C42B25` for small text on white (AA contrast) |
| Ink / body | near-black ink `#15191E`, body `#444E57`, body grey, warm off-white and cool grey section tones |
| Display type | Manrope 700–800, tight tracking, fluid `clamp()` sizes |
| Text type | Inter 400–600, 1.6 line-height |
| Radius | 10 / 18 px; pills for chips |
| Layout | 1280 px container, fluid gutters, 12-col feel via CSS grid |

Red is used sparingly: kickers, primary CTA, a single accent word in the hero, map nodes.

## Motion (all gated by `prefers-reduced-motion` and a `.js` class so content is visible without JS)
- Hero line reveal and gentle parallax.
- IntersectionObserver section reveals.
- SVG route network: animated corridor paths between the 14 branches (positions approximate, labelled as illustrative).
- Count-ups only for verified numbers (25+ years, 14 branches, 9/5 split).
- Scroll-linked process steps on the homepage.

## Accessibility
Skip link, landmark regions, one H1 per page, logical H2/H3, visible focus rings, keyboard mega-menu (opens on focus/click, Esc closes and returns focus), mobile menu toggle button (Esc closes), accordions via `<details>/<summary>`, labelled form fields with inline errors and `aria-live` status, touch targets ≥ 44 px, AA colour contrast for body and button text.
