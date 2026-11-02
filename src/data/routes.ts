/**
 * Every internal route the site links to, in one place.
 * Only `home` exists today; the others are planned pages. Keep links pointing
 * here so adding a page is a matter of creating `src/pages/<route>.astro`.
 */
export const routes = {
  home: '/',
  platform: '/platform',
  solutions: '/solutions',
  cases: '/success-stories',
  about: '/about',
  contact: '/contact',
  demo: '/contact?topic=demo',
  privacy: '/privacy',
  legal: '/legal',
  sectors: {
    grid: '/grid',
    solar: '/solar',
    wind: '/wind',
    oilGas: '/oil-gas',
    climate: '/climate-resilience',
    digitalization: '/digitalization',
  },
} as const;

export const external = {
  azure:
    'https://marketplace.microsoft.com/en-us/product/saas/woza.riskintelligence_woza?tab=overview',
  linkedin: 'https://www.linkedin.com/company/predicterra/',
  woza: 'https://www.wozalabs.com',
  iberdrolaCoverage:
    'https://www.latitudemedia.com/news/iberdrola-turns-to-ai-for-power-line-resilience/',
} as const;
