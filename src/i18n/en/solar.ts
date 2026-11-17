import type { SectorCopy } from '../../sections/pages/types';
import { actions, cta, cases } from './pages-shared';

// /solar, from "predicterra-04-solar.md". Copy word for word; eyebrows left out.
export default {
  seo: {
    title: 'Climate Risk and Asset Intelligence for Solar Portfolios | Predicterra',
    description:
      'The Cognitive Twin for solar portfolios. Heat, fire, flood, wind and drought risk per plant, and the production at stake, from the next 14 days to 2100.',
  },
  hero: {
    label: 'Predicterra for Solar',
    title: 'See what’s coming to every plant.',
    text: 'Protect production through every heatwave, site new plants where the future climate allows, and give lenders and insurers numbers they can underwrite.',
    primary: actions.demo,
    secondary: actions.platform,
  },
  asset: 'solar',
  // No solar case published yet: the first three figures are platform capability.
  metrics: {
    items: [
      { value: '14 days', text: 'of plant-level forecasts' },
      { value: 'To 2100', text: 'climate scenarios for the whole asset life' },
      { value: '6', text: 'hazards on one model, compound risk included' },
      { value: '95%', text: 'less time producing climate and compliance reports' },
    ],
    backing: {
      text: 'Proven in operation on 116,000 km of Spanish distribution grid, the kind of network your plants export through.',
      link: cases.all,
    },
  },
  what: {
    title: 'Every plant, block by block, on one model.',
    text: 'Predicterra models your plants and the forces acting on them: heat, wildfire, flood, wind, drought and vegetation. It forecasts derating, stow and fire risk per block for the next 14 days, tests siting and yield against the climate to 2100, and quantifies the production at risk across your portfolio. O&M, development, asset management and compliance work from the same picture.',
    uses: [
      'Heat and derating',
      'Tracker stow',
      'Wildfire at the fence line',
      'Equipment flooding',
      'Vegetation management',
      'Siting',
      'Yield under future climate',
      'Insurance and lender due diligence',
    ],
  },
  why: {
    title: 'A solar plant is a thirty-year bet on the climate of one place.',
    items: [
      {
        icon: 'science',
        title: 'Physics, not scores',
        text: 'We model how each block, inverter and substation responds to the weather, instead of rating the location.',
      },
      {
        icon: 'euro',
        title: 'From O&M to the lender',
        text: 'The same numbers serve O&M, insurers, lenders and the EU Taxonomy.',
      },
      {
        icon: 'api',
        title: 'Works with what you have',
        text: 'Reads your SCADA, performance monitoring and yield models, and sends risk events back into them.',
      },
      {
        icon: 'lock',
        title: 'Built in Europe',
        text: 'EU-hosted or on-premises, and independent of any energy company or vendor.',
      },
    ],
  },
  cta: cta(
    'Your monitoring knows how your plants perform.',
    'Predicterra knows',
    'what’s coming to them.',
    'See your portfolio in the Cognitive Twin. Start with one problem, on your own data.',
  ),
} satisfies SectorCopy;
