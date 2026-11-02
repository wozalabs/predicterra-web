// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Production origin. Used for canonical URLs, Open Graph and the sitemap.
// The GitHub Pages workflow overrides both (SITE_URL, SITE_BASE) for the preview
// at https://wozalabs.github.io/predicterra-web/.
const SITE = process.env.SITE_URL ?? 'https://www.predicterra.com';
const BASE = process.env.SITE_BASE ?? '/';

export default defineConfig({
  site: SITE,
  base: BASE,
  trailingSlash: 'ignore',
  // English ships first. Add 'es' to `locales` and a `src/i18n/es` folder
  // when the Spanish copy is ready; routes become /es/... automatically.
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
    routing: { prefixDefaultLocale: false },
  },
  integrations: [
    sitemap({
      i18n: { defaultLocale: 'en', locales: { en: 'en' } },
      // Internal comparison pages are never indexed.
      filter: (page) => !page.includes('/lab/'),
    }),
  ],
  build: { inlineStylesheets: 'auto' },
  prefetch: { prefetchAll: false, defaultStrategy: 'hover' },
});
