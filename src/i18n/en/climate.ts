import { routes } from '../../data/routes';
import { actions, logoBands, howToStart, cta } from './pages-shared';

// /climate-resilience, from "predicterra-climate-resilience.md". Copy word for word; eyebrows left out.
export default {
  seo: {
    title: 'Climate Resilience and Adaptation Planning for Energy | Predicterra',
    description:
      'Quantify physical climate exposure for every energy asset to 2100, and turn it into adaptation plans and resilience investment cases your board and regulator can follow.',
  },

  hero: {
    label: 'Climate & Resilience · Across every sector',
    title: 'Resilience isn’t a report you file. It’s a capability you build.',
    text: 'Predicterra quantifies the exposure of every asset, from today to 2100, and turns it into adaptation plans and investment cases your board and your regulator can follow.',
    primary: actions.demo,
    secondary: actions.platform,
    visual:
      'The homepage territory with every asset (grid, solar, wind, refinery) and a time control moving through the decades. As it advances, each asset’s exposure changes colour; a small selector switches between climate scenarios.',
    decades: ['2030', '2050', '2100'],
    scenarios: ['Low', 'Intermediate', 'High'],
  },

  logos: logoBands.standard,

  proof: {
    items: [
      { value: 'To 2100', text: 'exposure per asset, decade by decade' },
      { value: 'Every scenario', text: 'the full range of climate pathways, not one number' },
      { value: '6 hazards', text: 'on one model, compound risk included' },
      { value: '10 years', text: 'of real incidents backtested' },
    ],
  },

  ahead: {
    title: 'Resilience is becoming the next decade’s biggest investment.',
    text: 'Assets approved today will operate in the climate of 2060. Europe is putting resilience at the center of its agenda, with a new climate resilience framework and more public finance behind it. Resilience cases with the evidence lenders ask for get funded first.',
    figures: [
      { value: '€70 billion', text: 'of climate resilience investment needed every year in the EU' },
      { value: '€30 billion', text: 'in resilience finance the EIB aims to reach by 2030' },
      { value: '40 to 60 years', text: 'the life of the assets being approved today' },
    ],
    sources: 'Sources: European Commission proposal of 27 October 2026; European Investment Bank.',
    visual: 'Full-bleed photo of energy infrastructure in a landscape with signs of extreme weather (drought or flood).',
  },

  how: {
    title: 'From exposure to an investment case, on one model.',
    steps: [
      { title: 'Quantify', text: 'Exposure for every asset, per hazard, per scenario and per decade.', shot: 'Exposure map' },
      { title: 'Price', text: 'Expected loss and the cost of doing nothing, in euros.', shot: 'Expected loss curve' },
      {
        title: 'Compare',
        text: 'Harden, relocate, underground or insure: risk reduced per euro, option by option.',
        shot: 'Option comparison',
      },
      {
        title: 'Defend',
        text: 'An investment case with the evidence behind every number, for the board, the regulator and lenders.',
        shot: 'Investment case cover',
      },
    ],
  },

  outputs: {
    title: 'Everything your resilience plan needs.',
    items: [
      { icon: 'trending_up', title: 'Exposure by scenario and decade', text: 'Where risk grows, how fast, and under which climate.' },
      { icon: 'euro', title: 'Expected loss', text: 'Per asset and across the portfolio, by scenario.' },
      { icon: 'tune', title: 'Adaptation priorities', text: 'Options ranked by the risk they remove per euro invested.' },
      { icon: 'map', title: 'Critical and optimal zones', text: 'Where to protect, and where to build next.' },
      { icon: 'description', title: 'Resilience investment cases', text: 'Ready for the board, the regulator and lenders.' },
      { icon: 'insights', title: 'Honest uncertainty', text: 'The spread across climate models, never one convenient number.' },
    ],
  },

  score: {
    title: 'Not a score. A model.',
    text: 'Climate risk scores rate a location. Predicterra models your assets: the forces that hit them, how they respond, and everything that depends on them. And because the same model runs from the 14-day forecast to 2100, your plan and your operations agree. What fails every winter shows up in the plan. If it doesn’t, the twin tells you.',
    columns: ['Climate risk score', 'Predicterra'],
    rows: [
      { label: 'Unit', cells: ['A location or a portfolio', 'Every asset, and its dependencies'] },
      { label: 'Method', cells: ['Statistical ratings', 'Simulated physics, calibrated on your incidents'] },
      { label: 'Horizon', cells: ['Long-term only', 'From the next 14 days to 2100'] },
      { label: 'Output', cells: ['A rating', 'Exposure, expected loss and the action that reduces it'] },
      { label: 'Validation', cells: ['Hard to check', 'Backtested against your own history'] },
    ],
  },

  sectors: {
    title: 'One resilience plan for your whole energy system.',
    items: [
      {
        name: 'Grid',
        icon: 'electrical_services',
        text: 'Hardening, undergrounding and new routes, prioritized by exposure to 2050.',
        href: routes.sectors.grid,
      },
      {
        name: 'Solar',
        icon: 'solar_power',
        text: 'Siting, design and yield tested against the climate of the plant’s whole life.',
        href: routes.sectors.solar,
      },
      {
        name: 'Wind',
        icon: 'wind_power',
        text: 'Siting, repowering and life extension against the wind of the next thirty years.',
        href: routes.sectors.wind,
      },
      {
        name: 'Oil & Gas',
        icon: 'oil_barrel',
        text: 'Protection, adaptation and business interruption, site by site.',
        href: routes.sectors.oilGas,
      },
    ],
  },

  start: howToStart('your assets'),

  cta: cta('See your exposure to 2100', 'in the', 'Cognitive Twin.'),
} as const;
