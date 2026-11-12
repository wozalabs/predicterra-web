import type { SectorCopy } from '../../sections/pages/types';
import { routes } from '../../data/routes';
import { actions, logoBands, howToStart, cta, cases } from './pages-shared';

// /solar, from "predicterra-solar.md". Copy word for word; eyebrows left out.
export default {
  seo: {
    title: 'Climate Risk and Asset Intelligence for Solar Portfolios | Predicterra',
    description:
      'The Cognitive Twin for solar portfolios. Heat, fire, flood, wind and drought risk per plant, and the production at stake, from the next 14 days to 2100.',
  },

  hero: {
    label: 'Predicterra for Solar',
    title: 'See what’s coming to every plant.',
    text: 'Protect production through every heatwave, site new plants where the future climate allows, and give lenders and insurers numbers they can underwrite. Heat, wildfire, flood, wind and drought on one model of your portfolio, from the next 14 days to 2100.',
    primary: actions.demo,
    secondary: actions.platform,
    visual:
      'Aerial view of a PV plant on the terrain: panel rows, inverters and the grid substation. Layers pass (heat, fire, water, wind) and a time control moves from Today to 14 days to 2050, with risk per block changing at each step.',
    layout: 'split',
  },

  logos: logoBands.onGrids,

  proof: {
    items: [
      { value: '14 days', text: 'of plant-level forecasts' },
      { value: 'To 2100', text: 'climate scenarios for the whole asset life' },
      { value: '30+', text: 'hazard models, ready on day one' },
      { value: '6', text: 'hazards on one model, compound risk included' },
    ],
    backing: {
      text: 'Proven in operation on 116,000 km of Spanish distribution grid, the kind of network your plants export through.',
      link: cases.all,
    },
  },

  ahead: {
    title: 'A solar plant is a thirty-year bet on the climate of one place.',
    text: 'Portfolios are growing fast, into hotter, drier and more exposed locations. Lenders, insurers and regulators want to know how each plant will hold up, not just this year, but for its whole life. So every plant has to be built, run and financed against the climate that’s coming, not the one in the record.',
    quote: 'You’re not betting on this year’s sun. You’re betting on the next thirty.',
    visual: 'Full-bleed photo of a solar plant in a dry landscape.',
  },

  models: {
    title: 'Every plant, and everything around it.',
    text: 'Predicterra represents every plant, block and piece of equipment as an object in one ontology, linked to the grid it exports through and the forces acting on it.',
    assets: [
      { icon: 'solar_power', title: 'PV plants and blocks', text: 'Risk resolved block by block, not by region.' },
      { icon: 'sunny', title: 'Modules and trackers', text: 'Heat, wind and stow conditions, plant by plant.' },
      {
        icon: 'electric_bolt',
        title: 'Inverters and transformers',
        text: 'Thermal stress and flood exposure where it matters most.',
      },
      { icon: 'battery_charging_full', title: 'Battery storage (BESS)', text: 'Heat and fire exposure, tied to the plant it serves.' },
      { icon: 'hub', title: 'Substations and grid connection', text: 'The link every plant exports through.' },
      { icon: 'add_road', title: 'Access roads and O&M bases', text: 'Whether crews can reach the plant when they need to.' },
    ],
    hazards: ['Extreme heat', 'Wildfire', 'Flood', 'Extreme wind', 'Drought', 'Vegetation'],
    compound: 'Compound risk, when they hit together. A heatwave during a drought cuts output and raises fire risk at the same time.',
  },

  teams: {
    title: 'One portfolio. Four teams. The same model.',
    items: [
      {
        name: 'Operations (O&M)',
        horizon: 'Today to 14 days',
        text: 'Heat, fire, flood and wind alerts per plant, with derating forecasts, stow and inspection windows, and safe access for crews.',
        useCases: [
          { title: 'Heat and derating', text: 'When panels and inverters run hot, and how much output is at stake.' },
          { title: 'Wildfire around plants', text: 'Fire risk at the fence line, and when to act.' },
          { title: 'Vegetation management', text: 'Mowing and clearing where fire risk is rising.' },
          { title: 'Flooding of equipment', text: 'Where the water will reach inverters, storage and substations.' },
          { title: 'Wind and tracker stow', text: 'Gusts per site, and when to stow before they arrive.' },
          { title: 'O&M windows', text: 'When crews can work, and when they can’t reach the plant.' },
        ],
        metric: 'Availability, production protected',
        shot: 'Platform capture: alerts per plant',
      },
      {
        name: 'Planning and development',
        horizon: '1 to 30 years',
        text: 'Siting, design and adaptation tested against climate scenarios to 2100, on your real project models.',
        useCases: [
          { title: 'Siting', text: 'New plants where the future climate allows.' },
          { title: 'Yield under future climate', text: 'Long-term production tested against scenarios to 2100.' },
        ],
        metric: 'Yield under future climate, capex efficiency',
        shot: 'Platform capture: siting map with scenarios',
      },
      {
        name: 'Risk and asset management',
        horizon: 'Every horizon',
        text: 'Production at risk across the portfolio, expected loss by scenario, and the exposure that comes through the grid connection. Quantified with the rigor insurers and lenders ask for.',
        useCases: [
          { title: 'Production at risk', text: 'Output lost to heat derating, stow and outages, across the portfolio.' },
          {
            title: 'Insurance and risk transfer',
            text: 'Quantified exposure to negotiate cover and support parametric policies.',
          },
        ],
        metric: 'Expected loss, insurance terms',
        shot: 'Platform capture: portfolio expected loss',
      },
      {
        name: 'Compliance',
        horizon: 'To 2100',
        text: 'EU Taxonomy, CSRD and lender due diligence, per plant, from the same model.',
        useCases: [
          {
            title: 'Lender and Taxonomy due diligence',
            text: 'Climate risk and vulnerability assessments per plant, ready for financing.',
          },
        ],
        metric: 'Hours of reporting saved',
        shot: 'Platform capture: report per plant',
      },
    ],
  },

  works: {
    title: 'Your monitoring knows how your plants perform. Predicterra knows what’s coming to them.',
    text: 'Most portfolios already run SCADA, performance monitoring and energy yield models. Predicterra doesn’t replace them. It reads them, adds the forces acting on every plant and the dependencies between them, and sends structured risk events back into the systems your teams already use.',
    reads: [
      'SCADA and performance monitoring',
      'Energy yield models and digital twins',
      'Asset registry and GIS',
      'O&M tickets and incident history',
      'Capex and development pipeline',
    ],
    returns: [
      'Risk per plant and per block',
      'Production at risk, by horizon',
      'Alerts with their reasoning',
      'Recommended actions and work windows',
      'Siting and adaptation priorities',
    ],
    closing: 'Already run a digital twin of your plants? Predicterra doesn’t replace it. It makes it cognitive.',
  },

  results: {
    title: 'Measured in the numbers your investors read.',
    text: 'We agree the success metric with you before we start, and measure it against your own data.',
    rows: [
      { report: 'Production at risk (MWh)', change: 'Quantified per plant and per scenario' },
      { report: 'Availability', change: 'Protected from weather, measured against your own baseline' },
      { report: 'Insurance terms', change: 'Exposure data insurers can underwrite' },
      { report: 'EU Taxonomy alignment', change: 'Climate risk and vulnerability assessments per plant' },
      { report: 'Time producing climate and compliance reports', change: '95% less' },
    ],
  },

  system: {
    title: 'A plant is only as safe as the grid it exports through.',
    text: 'Your plants share land, weather and substations with the grid, wind farms and storage around them. In Predicterra they sit in one model, so a risk on the grid shows up in your production, and the other way round.',
    center: 'Solar',
    nodes: [
      { label: 'Grid', href: routes.sectors.grid },
      { label: 'Wind', href: routes.sectors.wind },
      { label: 'Oil & Gas', href: routes.sectors.oilGas },
      { label: 'Storage' },
    ],
  },

  start: howToStart('your portfolio'),

  cta: cta('See your portfolio', 'in the', 'Cognitive Twin.'),
} satisfies SectorCopy;
