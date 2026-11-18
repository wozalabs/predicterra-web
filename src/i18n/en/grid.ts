import type { SolutionCopy } from '../../sections/pages/types';
import { actions, cta, proof } from './pages-shared';

// /grid, from "predicterra-04-grid.md". Final copy; section eyebrows left out.
export default {
  seo: {
    title: 'Grid Resilience and Asset Intelligence for DSOs and TSOs | Predicterra',
    description:
      'The Cognitive Twin for transmission and distribution networks: fire, flood, wind, heat and vegetation risk per span and substation.',
  },
  hero: {
    label: 'Predicterra for Grid',
    title: 'See what’s coming to every span and substation.',
    text: 'Put crews in place before the storm, invest in hardening where it cuts the most risk, and give the regulator evidence it can follow.',
    primary: actions.demo,
    secondary: actions.platform,
  },
  asset: 'grid',
  proof: proof.grid,
  metrics: [
    { value: '73%', text: 'faster response to climate events at i-DE' },
    { value: '116,000 km', text: 'of UFD’s grid in one model' },
    { value: 'Up to 14 days', text: 'of asset-level forecasts' },
    { value: '10 years', text: 'of real incidents backtested' },
  ],
  solution: {
    title: 'Grids are being asked to do more than ever.',
    figures: [
      { value: '€1.2 trillion', text: 'needed in EU electricity grids by 2040' },
      { value: '~393,000 ha', text: 'burned in Spain in 2025, the most since 1994' },
      { value: '~180,000', text: 'customers left without power by the 2024 Valencia floods' },
    ],
    figuresFirst: true,
    paragraphs: [
      'Predicterra represents every span, pole, feeder, substation and transformer as an object in one ontology, linked to what feeds it, what it feeds and the risks acting on it: wind, wildfire, flood, heat, drought and vegetation encroachment. Control center, asset management, risk and regulation work from that same model, from span-level risk up to 14 days ahead to resilience plans to 2100.',
      'Predicterra reads your GIS, LiDAR, SCADA, ADMS and OMS, and sends structured risk events back into the systems your teams already use.',
    ],
    sources:
      'Sources: European Commission, European Grids Package (December 2025); EFFIS, 2025 burned area; i-DE, customers affected by the 2024 Valencia floods.',
  },
  list: {
    title: 'Everything your grid faces, on one model.',
    kind: 'uses',
    items: [
      { title: 'Storm and wind impact', text: 'Which spans and poles will fail, and when.' },
      { title: 'Vegetation encroachment', text: 'Trimming prioritized by risk, span by span.' },
      { title: 'Wildfire ignition', text: 'Where your lines could start a fire, and when to act.' },
      { title: 'Substation flooding', text: 'Where the water will reach, and what goes dark with it.' },
      { title: 'Crew pre-positioning', text: 'Crews and spares where the event will hit.' },
      { title: 'Hardening and undergrounding', text: 'Reinforcement and undergrounding ranked by real exposure.' },
    ],
  },
  cta: cta('See your network', 'in the', 'Cognitive Twin.'),
} satisfies SolutionCopy;
