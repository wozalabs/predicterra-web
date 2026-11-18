import type { SolutionCopy } from '../../sections/pages/types';
import { actions, cta, proof } from './pages-shared';
import { routes } from '../../data/routes';

// /digitalization, from "predicterra-09-digitalization.md". For those who decide
// the architecture (CIO, CDO, digital transformation, data teams). Final copy;
// section eyebrows left out.
export default {
  seo: {
    title: 'Cognitive Digital Twin for Energy Operators | Predicterra',
    description:
      'A cognitive digital twin of your assets and the physical world acting on them, ready for every team, system and AI agent, EU-hosted or on-premises.',
  },
  hero: {
    label: 'Digitalization · Across all sectors',
    title: 'A cognitive digital twin of the physical world, ready to consume.',
    text: 'Predicterra fuses your systems and thousands of external sources into a Cognitive Twin: a live model of your assets, the physical world acting on them and how everything connects, ready for every team, every system and every AI agent.',
    primary: actions.demo,
    secondary: actions.platform,
  },
  proof: proof.standard,
  metrics: [
    { value: '11,000+', text: 'data sources, connected and maintained' },
    { value: '116,000 km', text: 'of UFD’s grid in one ontology' },
    { value: '14 vs 48', text: 'integrations for six asset types and eight use cases' },
    { value: 'Weeks', text: 'for each new use case' },
  ],
  solution: {
    title: 'The energy system is going digital, and the physical world has to come with it.',
    paragraphs: [
      'Operators are investing in data platforms, digital twins and AI, and Europe has asked its grid operators for a digital twin of the European electricity grid. Most models still describe the assets and leave out the world around them: the weather, the terrain, the vegetation and the dependencies with other sectors.',
      'In Predicterra’s ontology, every asset keeps its ID from your systems and gains its relationships: what feeds it, what it feeds and what threatens it. Each system connects once through an open API, so six asset types and eight use cases need 14 integrations, compared with 48 built one by one. The same ontology gives AI agents the context they need, limits their actions to real objects and records what every proposal is based on.',
    ],
    sources: 'Source: EU Action Plan for the Digitalisation of the Energy System (ENTSO-E and EU DSO Entity).',
  },
  list: {
    title: 'It works with the systems each sector already runs.',
    kind: 'sectors',
    items: [
      {
        title: 'Grid',
        text: 'Reads your GIS, LiDAR, SCADA, ADMS and OMS, and returns risk per span, pole and substation.',
        href: routes.sectors.grid,
      },
      {
        title: 'Solar',
        text: 'Reads your SCADA, performance monitoring and yield models, and returns risk per plant and per block.',
        href: routes.sectors.solar,
      },
      {
        title: 'Wind',
        text: 'Reads your turbine SCADA, condition monitoring and met masts, and returns risk per turbine and per site.',
        href: routes.sectors.wind,
      },
      {
        title: 'Oil & Gas',
        text: 'Reads your DCS, SCADA, historians and integrity records, and returns risk per unit, tank and segment.',
        href: routes.sectors.oilGas,
      },
    ],
  },
  cta: cta('Give your systems', 'a world', 'to run on.'),
} satisfies SolutionCopy;
