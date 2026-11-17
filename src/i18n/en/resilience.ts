import { actions, cta } from './pages-shared';

// /resilience, from "predicterra-07-resilience.md". Copy word for word; eyebrows left out.
export default {
  seo: {
    title: 'Climate Resilience and Adaptation Planning for Energy | Predicterra',
    description:
      'Quantify physical climate exposure for every energy asset to 2100, and turn it into adaptation plans and investment cases your board, regulator and lenders can follow.',
  },
  hero: {
    label: 'Resilience · Across every sector',
    title: 'Resilience isn’t a report you file. It’s a capability you build.',
    text: 'Predicterra quantifies the exposure of every asset, from today to 2100, and turns it into adaptation plans and investment cases your board, your regulator and your lenders can follow.',
    primary: actions.demo,
    secondary: actions.platform,
  },
  metrics: [
    { value: 'To 2100', text: 'exposure per asset, decade by decade' },
    { value: 'Every scenario', text: 'the full range of climate pathways, not one number' },
    { value: '6 hazards', text: 'on one model, compound risk included' },
    { value: '10 years', text: 'of real incidents backtested' },
  ],
  now: {
    title: 'Resilience is becoming the next decade’s biggest investment.',
    text: 'Assets approved today will operate in the climate of 2060. Resilience cases with the evidence lenders ask for get funded first.',
    figures: [
      { value: '€70 billion', text: 'of climate resilience investment needed every year in the EU' },
      { value: '€30 billion', text: 'in resilience finance the EIB aims to reach by 2030' },
      { value: '40 to 60 years', text: 'the life of the assets being approved today' },
    ],
    sources: 'Sources: European Commission proposal of 27 October 2026; European Investment Bank.',
  },
  how: {
    title: 'From exposure to an investment case.',
    steps: [
      { title: 'Quantify', text: 'Exposure for every asset, per hazard, per scenario and per decade.' },
      { title: 'Price', text: 'Expected loss and the cost of doing nothing, in euros.' },
      { title: 'Compare', text: 'Harden, relocate, underground or insure: risk reduced per euro, option by option.' },
      { title: 'Defend', text: 'An investment case with the evidence behind every number.' },
    ],
  },
  why: {
    title: 'Not a score. A model.',
    text: 'Climate risk scores rate a location. Predicterra models your assets: the forces that hit them, how they respond and everything that depends on them. And because the same model runs from the 14-day forecast to 2100, your plan and your operations agree.',
  },
  cta: cta('See your exposure to 2100', 'in the', 'Cognitive Twin.'),
} as const;
