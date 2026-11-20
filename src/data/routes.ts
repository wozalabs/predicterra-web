/**
 * Every internal route the site links to, in one place (site map of the
 * November 2026 briefs). Keep links pointing here.
 */
export const routes = {
  home: '/',
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
  /** The single Solution page (the solution, sectors and use across them). */
  solution: '/solution',
  /** Its sections, where the earlier sector and solution pages pointed. */
  sectors: {
    grid: '/solution#grid',
    solar: '/solution#solar',
    wind: '/solution#wind',
    oilGas: '/solution#oil-gas',
    resilience: '/solution#covers',
    compliance: '/solution#capabilities',
    digitalization: '/solution#capabilities',
  },
} as const;

export const external = {
  azure:
    'https://marketplace.microsoft.com/en-us/product/saas/woza.riskintelligence_woza?tab=overview',
  linkedin: 'https://www.linkedin.com/company/predicterra/',
  woza: 'https://www.wozalabs.com',
  iberdrolaCoverage:
    'https://www.latitudemedia.com/news/iberdrola-turns-to-ai-for-power-line-resilience/',
  /** Published articles behind each case (Cases page). */
  caseIde:
    'https://iberdrola.com/press-room/news/detail/iberdrola-teams-up-basque-startup-woza-shield-power-lines-climate-change',
  /** E.DSO success cases listing, until the direct link to the UFD case is confirmed. */
  caseUfd: 'https://www.edsoforsmartgrids.eu/success-cases/',
  caseMoeve: 'https://www.moeveglobal.com/en/press/moeve-startups-energy-transition',
} as const;
