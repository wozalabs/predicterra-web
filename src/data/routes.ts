/**
 * Every internal route the site links to, in one place (site map of the
 * November 2026 briefs). Keep links pointing here.
 */
export const routes = {
  home: '/',
  /** New home content, side by side with the current one for comparison. */
  homeNew: '/home-new',
  platform: '/platform',
  cases: '/cases',
  /** Case detail pages from the earlier site (linked from the current home). */
  stories: '/success-stories',
  about: '/about',
  contact: '/contact',
  demo: '/contact?topic=demo',
  engineer: '/contact?topic=engineer',
  privacy: '/privacy',
  legal: '/legal',
  cookies: '/cookies',
  sectors: {
    grid: '/grid',
    solar: '/solar',
    wind: '/wind',
    oilGas: '/oil-gas',
    resilience: '/resilience',
    compliance: '/compliance',
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
