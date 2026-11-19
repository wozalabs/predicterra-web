import type { SolutionCopy } from '../../sections/pages/types';
import { actions, cta, proof } from './pages-shared';
import { routes } from '../../data/routes';

// /resilience, from "predicterra-08-resilience.md". Final copy; section eyebrows
// left out. "Proposed" stays on the reference trajectory until the law passes.
export default {
  seo: {
    title: 'Climate Resilience and Adaptation Planning for Energy | Predicterra',
    description:
      'Quantify physical climate exposure for every energy asset to 2100, and turn it into adaptation plans and resilience investment cases your board and regulator can follow.',
  },
  hero: {
    title: 'From exposure to an investment case, on one model.',
    text: 'Predicterra quantifies the exposure of every asset, from today to 2100, and turns it into adaptation plans and investment cases your board and your regulator can follow.',
    primary: actions.demo,
    secondary: actions.platform,
  },
  proof: proof.standard,
  metrics: [
    { value: 'To 2100', text: 'exposure per asset, decade by decade' },
    { value: 'Every scenario', text: 'the full range of climate pathways' },
    { value: '6 hazards', text: 'on one model, compound risk included' },
    { value: '10 years', text: 'of real incidents backtested' },
  ],
  solution: {
    title: 'Resilience is becoming the next decade’s biggest investment.',
    paragraphs: [
      'Assets approved today will operate in the climate of 2060, and Europe is putting resilience at the center of its agenda, with a new climate resilience framework and more public finance behind it. Predicterra models your assets, the forces that hit them, how they respond and everything that depends on them. Every scenario includes the EU’s proposed reference trajectory, with 2 °C of warming by 2050 and 3 °C by 2100. It prices the cost of doing nothing and compares hardening, relocating, undergrounding and insuring by the risk each option removes per euro.',
    ],
    figures: [
      { value: '€70 billion', text: 'of climate resilience investment needed every year in the EU' },
      { value: '€30 billion', text: 'in EIB climate adaptation finance, 2026 to 2030' },
      { value: '40 to 60 years', text: 'the life of the assets being approved today' },
    ],
    sources:
      'Sources: European Commission, Climate Resilience Framework (October 27, 2026); EIB Group Climate Adaptation Plan (October 22, 2026). The reference trajectory comes from the proposed Climate Resilience Law.',
  },
  list: {
    title: 'One resilience plan for your whole energy system.',
    kind: 'sectors',
    items: [
      { title: 'Grid', text: 'Hardening, undergrounding and new routes, prioritized by exposure to 2050.', href: routes.sectors.grid },
      { title: 'Solar', text: 'Siting, design and yield tested against the climate of the plant’s whole life.', href: routes.sectors.solar },
      { title: 'Wind', text: 'Siting, repowering and life extension against the wind of each turbine’s whole life.', href: routes.sectors.wind },
      { title: 'Oil & Gas', text: 'Protection, adaptation and business interruption, site by site.', href: routes.sectors.oilGas },
    ],
  },
  cta,
} satisfies SolutionCopy;
