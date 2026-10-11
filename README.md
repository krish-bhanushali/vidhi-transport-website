# Vidhi Transport — corporate website

Source for https://www.vidhitransport.com. Astro 5 static build → plain HTML/CSS/JS in **`publish/`**, which is uploaded to `public_html`. No Node, PHP or database on the host.

```bash
npm ci
npm run build     # → publish/ (+ sitemap.xml, robots.txt)
npm run check     # release gate: metadata, links, assets, JSON-LD, sitemap, all 54 live URLs preserved
npm run preview   # http://localhost:4175 (python3 static server)
```

- Content: `src/config/site.ts` (company facts), `src/data/*.json` (branches, services, articles, industries, pages).
- Docs: `docs/` — start with `deployment-guide.md`, `integrations-and-owner-inputs.md`, `qa-report.md`.
- GitHub Pages preview (noindex): https://krish-bhanushali.github.io/vidhi-transport-website/ — activate by copying `deploy/github-workflows/*.yml` into `.github/workflows/` (see that folder's README).
- Previous repository state: tag `pre-redesign-backup`.
