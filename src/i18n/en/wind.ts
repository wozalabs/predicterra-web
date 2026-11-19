import type { SolutionCopy } from '../../sections/pages/types';
import { actions, cta, proof } from './pages-shared';

// /wind, from "predicterra-06-wind.md". Final copy; section eyebrows left out.
// No wind case is published yet: the metrics are platform capabilities.
export default {
  seo: {
    title: 'Climate Risk and Asset Intelligence for Wind Farms | Predicterra',
    description: 'The Cognitive Twin for wind portfolios: gusts, storms, fire, heat and flood risk per turbine and site.',
  },
  hero: {
    title: 'See what’s coming to every turbine.',
    text: 'Know which turbines will hit cut-out before the storm, book cranes for the right days, and repower where the future wind allows.',
    primary: actions.demo,
    secondary: actions.platform,
  },
  asset: 'wind',
  proof: proof.onTheGrids('turbines export through'),
  metrics: [
    { value: 'Up to 14 days', text: 'of turbine-level forecasts' },
    { value: 'To 2100', text: 'climate scenarios for the whole asset life' },
    { value: '30+', text: 'hazard models, ready on day one' },
    { value: '6', text: 'hazards on one model, compound risk included' },
  ],
  solution: {
    title: 'Every wrong call on the weather costs production.',
    paragraphs: [
      'As portfolios grow and repower, those calls multiply. Predicterra represents every turbine as an object in one ontology, linked to the site, the grid it exports through and the forces acting on it: wind, wildfire, heat, flood and drought, plus the vegetation that fuels fire around each site. O&M, development, asset management and compliance work from that same model, with gusts and cut-out forecast up to 14 days ahead and repowering and life extension tested against the wind of each turbine’s whole life.',
      'Predicterra reads your turbine SCADA, condition monitoring, met masts and LiDAR, and sends structured risk events back into the systems your teams already use.',
    ],
  },
  list: {
    title: 'Everything your turbines face, on one model.',
    kind: 'uses',
    items: [
      { title: 'Gust and storm forecasting', text: 'Damaging gusts per turbine, with the time window.' },
      {
        title: 'Shutdown and restart windows',
        text: 'When to stop each turbine ahead of high winds, and when it’s safe to bring it back.',
      },
      { title: 'Lifting windows', text: 'When the wind allows crane lifts for major component exchanges.' },
      { title: 'Safe crew access', text: 'When roads and wind let crews reach and climb each turbine.' },
      { title: 'Production at risk', text: 'Output lost to weather, across the portfolio.' },
      { title: 'Siting, repowering and life extension', text: 'Each option tested against climate scenarios to 2100.' },
    ],
  },
  cta,
} satisfies SolutionCopy;
