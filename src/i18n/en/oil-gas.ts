import type { SectorCopy } from '../../sections/pages/types';
import { actions, cta, cases } from './pages-shared';

// /oil-gas, from "predicterra-06-oil-gas.md". Copy word for word; eyebrows left out.
export default {
  seo: {
    title: 'Physical Risk and Asset Intelligence for Oil & Gas | Predicterra',
    description:
      'The Cognitive Twin for refineries, terminals, pipelines and gas networks. Fire, flood, heat, wind and drought risk per unit and corridor, from the next 14 days to 2100.',
  },
  hero: {
    label: 'Predicterra for Oil & Gas',
    title: 'See what’s coming to every site and pipeline.',
    text: 'Protect sites and pipelines before the fire or flood arrives, plan turnarounds and maintenance around real risk, and give insurers exposure they can price.',
    primary: actions.demo,
    secondary: actions.platform,
  },
  asset: 'oilgas',
  // No oil & gas case published yet: the first three figures are platform capability.
  metrics: {
    items: [
      { value: '14 days', text: 'of site-level forecasts' },
      { value: 'To 2100', text: 'climate scenarios for the whole asset life' },
      { value: '6', text: 'hazards on one model, compound risk included' },
      { value: '95%', text: 'less time producing climate and compliance reports' },
    ],
    backing: {
      text: 'Selected by Moeve for its Light Up program. Proven in operation on 116,000 km of Spanish distribution grid, the kind of network your sites depend on for power.',
      link: cases.all,
    },
  },
  what: {
    title: 'Every unit, tank and segment, on one model.',
    text: 'Predicterra models your refineries, terminals, pipelines and gas networks, and the forces acting on them: wildfire, flood, heat, wind, drought and vegetation along every right-of-way. It sends alerts per unit and segment for the next 14 days, places turnarounds and inspections around real risk, and quantifies business interruption by scenario. Operations, integrity, risk and compliance work from the same picture.',
    uses: [
      'Wildfire around sites and corridors',
      'Flooding of units and tank farms',
      'Heat and process limits',
      'Drought and cooling water',
      'Wind at terminals and jetties',
      'Right-of-way vegetation',
      'Turnaround scheduling',
      'Security of supply',
      'Business interruption and insurance',
    ],
  },
  why: {
    title: 'Make every stop one you chose.',
    items: [
      {
        icon: 'science',
        title: 'Physics, not scores',
        text: 'Every unit, tank and segment is modeled with what it depends on: power, cooling water and transport.',
      },
      {
        icon: 'groups',
        title: 'One model, every team',
        text: 'Operations, integrity, risk and compliance read the same numbers.',
      },
      {
        icon: 'api',
        title: 'Works with what you have',
        text: 'Reads your DCS, SCADA, historians and integrity records, and sends risk events back into them.',
      },
      {
        icon: 'lock',
        title: 'Built in Europe',
        text: 'EU-hosted or on-premises, and independent of any energy company or vendor.',
      },
    ],
  },
  cta: cta(
    'Your control systems know how your assets run.',
    'Predicterra knows',
    'what’s coming to them.',
    'See your sites and networks in the Cognitive Twin. Start with one problem, on your own data.',
  ),
} satisfies SectorCopy;
