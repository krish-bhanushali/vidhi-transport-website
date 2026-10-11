# Updated GitHub Actions workflows (needs one manual step)

The push token used for this rebuild lacks GitHub's `workflow` scope, so `.github/workflows/` still holds the **old** workflows:
- `seo-ci.yml` still runs `node scripts/check-site.mjs` — this now validates the committed `publish/` folder and passes.
- `pages.yml` still copies root-level `*.html` files, which no longer exist, so the GitHub Pages preview deploy **fails** until replaced.

To switch to the Astro workflows (build with `BASE_PATH=/vidhi-transport-website/`, noindex preview, deploy `publish/`):
```bash
gh auth refresh -h github.com -s workflow     # once
cp deploy/github-workflows/*.yml .github/workflows/
git add .github/workflows && git commit -m "Build Astro and deploy publish/ to GitHub Pages" && git push
```
Or paste the two files into `.github/workflows/` through the GitHub web editor.
