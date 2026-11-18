import type { SolutionCopy } from '../../sections/pages/types';
import { actions, cta, proof } from './pages-shared';

// /solar, from "predicterra-05-solar.md". Final copy; section eyebrows left out.
// No solar case is published yet: the metrics are platform capabilities.
export default {
  seo: {
    title: 'Climate Risk and Asset Intelligence for Solar Portfolios | Predicterra',
    description:
      'The Cognitive Twin for solar portfolios: heat, fire, flood, wind and drought risk per plant, and the production at stake.',
  },
  hero: {
    label: 'Predicterra for Solar',
    title: 'See what’s coming to every plant.',
    text: 'Protect production through every heatwave, site new plants where the future climate allows, and give lenders and insurers numbers they can underwrite.',
    primary: actions.demo,
    secondary: actions.platform,
  },
  asset: 'solar',
  proof: proof.onTheGrids('plants export through'),
  metrics: [
    { value: 'Up to 14 days', text: 'of plant-level forecasts' },
    { value: 'To 2100', text: 'climate scenarios for the whole asset life' },
    { value: '30+', text: 'hazard models, ready on day one' },
    { value: '6', text: 'hazards on one model, compound risk included' },
  ],
  solution: {
    title: 'A solar plant is a thirty-year bet on the climate of one place.',
    paragraphs: [
      'Portfolios are growing fast, into hotter, drier and more exposed locations, and lenders, insurers and regulators want to know how each plant will hold up for its whole life. Predicterra represents every plant, block and piece of equipment as an object in one ontology, linked to the grid it exports through and the forces acting on it: heat, wildfire, flood, wind and drought, plus the vegetation that fuels fire at the fence line. O&M, development, asset management and compliance work from that same model, which covers derating and stow windows up to 14 days ahead and yield under the climate of 2100.',
      'Predicterra reads your SCADA, performance monitoring and energy yield models, and sends structured risk events back into the systems your teams already use.',
    ],
  },
  list: {
    title: 'Everything your plants face, on one model.',
    kind: 'uses',
    items: [
      { title: 'Heat and derating', text: 'When panels and inverters run hot, and how much output is at stake.' },
      { title: 'Wind and tracker stow', text: 'Gusts per site, and when to stow before they arrive.' },
      { title: 'Wildfire around plants', text: 'Fire risk at the fence line, and when to act.' },
      { title: 'Flooding of equipment', text: 'Where the water will reach inverters, storage and substations.' },
      { title: 'Yield under future climate', text: 'Long-term production tested against scenarios to 2100.' },
      {
        title: 'Lender and Taxonomy due diligence',
        text: 'Climate risk and vulnerability assessments per plant, ready for financing.',
      },
    ],
  },
  cta: cta('See your portfolio', 'in the', 'Cognitive Twin.'),
} satisfies SolutionCopy;
