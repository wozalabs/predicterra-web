import type { SectorCopy } from '../../sections/pages/types';
import { actions, cta, cases } from './pages-shared';

// /wind, from "predicterra-05-wind.md". Copy word for word; eyebrows left out.
export default {
  seo: {
    title: 'Climate Risk and Asset Intelligence for Wind Farms | Predicterra',
    description:
      'The Cognitive Twin for wind portfolios. Gusts, storms, fire, heat and flood risk per turbine and site, from the next 14 days to 2100.',
  },
  hero: {
    label: 'Predicterra for Wind',
    title: 'See what’s coming to every turbine.',
    text: 'Stop before the storm and restart as soon as it’s safe, book cranes for the right days, and repower where the future wind allows.',
    primary: actions.demo,
    secondary: actions.platform,
  },
  asset: 'wind',
  // No wind case published yet: the first three figures are platform capability.
  metrics: {
    items: [
      { value: '14 days', text: 'of turbine-level forecasts' },
      { value: 'To 2100', text: 'climate scenarios for the whole asset life' },
      { value: '6', text: 'hazards on one model, compound risk included' },
      { value: '95%', text: 'less time producing climate and compliance reports' },
    ],
    backing: {
      text: 'Proven in operation on 116,000 km of Spanish distribution grid, the kind of network your turbines export through.',
      link: cases.all,
    },
  },
  what: {
    title: 'Every turbine, every lift, on one model.',
    text: 'Predicterra models your turbines and the forces acting on them: wind, wildfire, heat, flood, vegetation and drought. It forecasts gusts and cut-out per turbine for the next 14 days, finds the windows to stop, restart, lift and climb, and tests siting, repowering and life extension against the wind of the next thirty years. O&M, development, asset management and compliance work from the same picture.',
    uses: [
      'Gust and storm forecasting',
      'Shutdown and restart windows',
      'Lifting windows',
      'Safe crew access',
      'Wildfire around farms',
      'Production at risk',
      'Siting, repowering and life extension',
      'Insurance and lender due diligence',
    ],
  },
  why: {
    title: 'Every wrong call on the weather costs production.',
    items: [
      {
        icon: 'wind_power',
        title: 'Turbine by turbine',
        text: 'Risk resolved per turbine, not per region, with the reason and the time window.',
      },
      {
        icon: 'groups',
        title: 'One model, every team',
        text: 'O&M, development, asset management and compliance read the same numbers.',
      },
      {
        icon: 'api',
        title: 'Works with what you have',
        text: 'Reads your turbine SCADA, condition monitoring, met masts and LiDAR, and sends risk events back into them.',
      },
      {
        icon: 'lock',
        title: 'Built in Europe',
        text: 'EU-hosted or on-premises, and independent of any energy company or vendor.',
      },
    ],
  },
  cta: cta(
    'Your SCADA knows how every turbine performs.',
    'Predicterra knows',
    'what’s coming to it.',
    'See your wind portfolio in the Cognitive Twin. Start with one problem, on your own data.',
  ),
} satisfies SectorCopy;
