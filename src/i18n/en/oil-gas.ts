import type { SolutionCopy } from '../../sections/pages/types';
import { actions, cta, proof } from './pages-shared';

// /oil-gas, from "predicterra-07-oil-gas.md". Final copy; section eyebrows left out.
// Pending: how the Moeve relationship can be mentioned; the metrics are platform
// capabilities until the Moeve case is published.
export default {
  seo: {
    title: 'Physical Risk and Asset Intelligence for Oil & Gas | Predicterra',
    description:
      'The Cognitive Twin for refineries, terminals, pipelines and gas networks: fire, flood, heat, wind and drought risk per unit and corridor.',
  },
  hero: {
    title: 'See what’s coming to every site and pipeline.',
    text: 'Protect sites and pipelines before the fire or flood arrives, plan turnarounds and maintenance around real risk, and give insurers exposure they can price.',
    primary: actions.demo,
    secondary: actions.platform,
  },
  asset: 'oilgas',
  proof: proof.oilGas,
  metrics: [
    { value: 'Up to 14 days', text: 'of site-level forecasts' },
    { value: 'To 2100', text: 'climate scenarios for the whole asset life' },
    { value: '30+', text: 'hazard models, ready on day one' },
    { value: '6', text: 'hazards on one model, compound risk included' },
  ],
  solution: {
    title: 'Make every stop one you chose.',
    paragraphs: [
      'Refineries, terminals, pipelines and gas networks run around the clock, across long corridors and exposed coastlines. Predicterra represents every unit, tank, terminal and pipeline segment as an object in one ontology, linked to the power, water and transport it depends on and to the forces acting on it: wildfire, flood, heat, wind and drought, plus vegetation encroachment along every right-of-way. Operations, integrity, risk and compliance work from that same model, with site alerts up to 14 days ahead and turnarounds and business interruption planned by scenario.',
      'Predicterra reads your DCS, SCADA, historians and integrity records, and sends structured risk events back into the systems your teams already use.',
    ],
  },
  list: {
    title: 'Everything your sites face, on one model.',
    kind: 'uses',
    items: [
      { title: 'Wildfire around sites and corridors', text: 'Fire risk at the fence line and along every segment.' },
      { title: 'Flooding of units and tank farms', text: 'Where the water will reach, and what has to stop.' },
      { title: 'Heat and process limits', text: 'When heat pushes units and storage close to their limits.' },
      { title: 'Drought and cooling water', text: 'When water stress threatens cooling and throughput.' },
      { title: 'Turnaround scheduling', text: 'Planned stops scheduled for the windows with the least weather risk.' },
      {
        title: 'Security of supply',
        text: 'Which segments and stations an event could take offline, and what depends on them.',
      },
    ],
  },
  cta,
} satisfies SolutionCopy;
