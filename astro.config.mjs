// @ts-check
import { defineConfig } from 'astro/config';

// Production build: base "/" for https://www.vidhitransport.com (upload publish/ to public_html).
// GitHub Pages preview sets BASE_PATH=/vidhi-transport-website/ in CI.
const base = process.env.BASE_PATH || '/';

export default defineConfig({
  site: 'https://www.vidhitransport.com',
  base,
  output: 'static',
  outDir: './publish',
  trailingSlash: 'ignore',
  compressHTML: true,
  build: {
    format: 'file', // about-us.astro -> about-us.html (matches live URLs)
    assets: 'assets/build',
    inlineStylesheets: 'never',
  },
  image: {
    responsiveStyles: false,
  },
  devToolbar: { enabled: false },
  vite: {
    build: { assetsInlineLimit: 0 },
  },
});
