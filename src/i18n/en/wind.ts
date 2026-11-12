import type { SectorCopy } from '../../sections/pages/types';
import { routes } from '../../data/routes';
import { actions, logoBands, howToStart, cta, cases } from './pages-shared';

// /wind, from "predicterra-wind.md". Copy word for word; eyebrows left out.
export default {
  seo: {
    title: 'Climate Risk and Asset Intelligence for Wind Farms | Predicterra',
    description:
      'The Cognitive Twin for wind portfolios. Gusts, storms, fire, heat and flood risk per turbine and site, from the next 14 days to 2100.',
  },

  hero: {
    label: 'Predicterra for Wind',
    title: 'See what’s coming to every turbine.',
    text: 'Stop before the storm and restart as soon as it’s safe, book cranes for the right days, and repower where the future wind allows. Wind, wildfire, heat and flood on one model of your portfolio, from the next 14 days to 2100.',
    primary: actions.demo,
    secondary: actions.platform,
    visual:
      'Aerial view of a wind farm on the relief: turbines, access roads and the collector substation. Layers pass (wind, fire, heat, water) and a time control moves from Today to 14 days to 2050, with risk per turbine changing at each step.',
    layout: 'centred',
  },

  logos: logoBands.onGrids,

  proof: {
    items: [
      { value: '14 days', text: 'of turbine-level forecasts' },
      { value: 'To 2100', text: 'climate scenarios for the whole asset life' },
      { value: '30+', text: 'hazard models, ready on day one' },
      { value: '6', text: 'hazards on one model, compound risk included' },
    ],
    backing: {
      text: 'Proven in operation on 116,000 km of Spanish distribution grid, the kind of network your turbines export through.',
      link: cases.all,
    },
  },

  ahead: {
    title: 'Every wrong call on the weather costs production.',
    text: 'Stop too early and you lose output. Stop too late and you risk the blades. Book a crane for a windy day and you pay for it to stand idle. As portfolios grow and repower, those calls multiply. And every repowering decision is a bet on the wind of the next thirty years.',
    visual: 'Full-bleed photo of wind turbines on a ridge under a stormy sky.',
  },

  models: {
    title: 'Every turbine, and everything around it.',
    text: 'Predicterra represents every turbine as an object in one ontology, linked to the site, the grid it exports through and the forces acting on it.',
    assets: [
      { icon: 'wind_power', title: 'Turbines', text: 'Risk resolved turbine by turbine, not by region.' },
      { icon: 'map', title: 'Wind farms and sites', text: 'Exposure across the whole site, and across the portfolio.' },
      { icon: 'hub', title: 'Collector substations', text: 'The grid link every farm depends on.' },
      { icon: 'add_road', title: 'Access roads', text: 'Whether crews and cranes can reach the turbine when needed.' },
      { icon: 'warehouse', title: 'O&M bases', text: 'Crews, spares and travel times, on the same model.' },
    ],
    hazards: ['Extreme wind', 'Wildfire', 'Extreme heat', 'Flood', 'Vegetation', 'Drought'],
    compound:
      'Compound risk, when they hit together. Drought and dry vegetation are what turn a spark near a turbine into a wildfire.',
  },

  teams: {
    title: 'One portfolio. Four teams. The same model.',
    items: [
      {
        name: 'Operations (O&M)',
        horizon: 'Today to 14 days',
        text: 'Gusts forecast per turbine, shutdown and restart windows, lifting windows for cranes, and safe access for crews.',
        useCases: [
          {
            title: 'Gust and storm forecasting',
            text: 'Which turbines will reach cut-out speeds or damaging gusts, and when.',
          },
          { title: 'Shutdown and restart windows', text: 'Stop before the storm, restart as soon as it’s safe.' },
          { title: 'Lifting windows', text: 'When the wind allows crane lifts for major component exchanges.' },
          { title: 'Safe crew access', text: 'When roads and wind let crews reach and climb each turbine.' },
          { title: 'Wildfire around farms', text: 'Fire risk across the site, and when to act.' },
          { title: 'Flooding of roads and substations', text: 'Where water will cut access or reach equipment.' },
          { title: 'Heat stress', text: 'Converters and transformers running close to their thermal limits.' },
        ],
        metric: 'Availability, production protected',
        shot: 'Platform capture: shutdown and access windows per turbine',
      },
      {
        name: 'Planning and development',
        horizon: '1 to 30 years',
        text: 'Maintenance scheduled around the weather; siting, layout, repowering and life extension tested against climate scenarios to 2100.',
        useCases: [
          {
            title: 'Siting, repowering and life extension',
            text: 'Where to build, repower or extend, against the wind of the next thirty years.',
          },
        ],
        metric: 'Yield under future climate, capex efficiency',
        shot: 'Platform capture: siting and repowering map with scenarios',
      },
      {
        name: 'Risk and asset management',
        horizon: 'Every horizon',
        text: 'Production and damage at risk per site and across the portfolio, expected loss by scenario, and exposure through the grid connection.',
        useCases: [
          { title: 'Production at risk', text: 'Output lost to weather, across the portfolio.' },
          { title: 'Insurance and lender due diligence', text: 'Quantified exposure for cover and financing.' },
        ],
        metric: 'Expected loss, insurance terms',
        shot: 'Platform capture: portfolio expected loss',
      },
      {
        name: 'Compliance',
        horizon: 'To 2100',
        text: 'EU Taxonomy, CSRD and lender due diligence, per site, from the same model.',
        useCases: [{ title: 'EU Taxonomy and CSRD', text: 'Climate risk and vulnerability assessments, per site.' }],
        metric: 'Hours of reporting saved',
        shot: 'Platform capture: report per wind farm',
      },
    ],
  },

  works: {
    title: 'Your SCADA knows how every turbine performs. Predicterra knows what’s coming to it.',
    text: 'Most wind portfolios already run turbine SCADA, condition monitoring and energy yield assessments. Predicterra doesn’t replace them. It reads them, adds the forces acting on every turbine and the dependencies between them, and sends structured risk events back into the systems your teams already use.',
    reads: [
      'Turbine SCADA, condition monitoring and digital twins',
      'Met masts, LiDAR and on-site measurements',
      'Energy yield assessments',
      'Asset registry and GIS',
      'O&M tickets and incident history',
    ],
    returns: [
      'Risk per turbine and per site',
      'Shutdown, restart and lifting windows',
      'Production at risk, by horizon',
      'Alerts with their reasoning',
      'Recommended actions and work windows',
    ],
    closing: 'Already run a digital twin of your turbines? Predicterra doesn’t replace it. It makes it cognitive.',
  },

  results: {
    title: 'Measured in the numbers your investors read.',
    text: 'We agree the success metric with you before we start, and measure it against your own data.',
    rows: [
      { report: 'Availability', change: 'Protected from weather, measured against your own baseline' },
      { report: 'Production lost to unplanned stops', change: 'Reduced, measured against your own baseline' },
      { report: 'Production at risk (MWh)', change: 'Quantified per turbine and per scenario' },
      { report: 'Insurance terms', change: 'Exposure data insurers can underwrite' },
      { report: 'Time producing climate and compliance reports', change: '95% less' },
    ],
  },

  system: {
    title: 'A wind farm is only as strong as the grid it feeds.',
    text: 'Your turbines share storms with the substations that collect their power and the lines that carry it, and often share sites with solar and storage. In Predicterra they sit in one model, so a storm is seen once, wherever it lands.',
    center: 'Wind',
    nodes: [
      { label: 'Grid', href: routes.sectors.grid },
      { label: 'Solar', href: routes.sectors.solar },
      { label: 'Oil & Gas', href: routes.sectors.oilGas },
      { label: 'Storage' },
    ],
  },

  start: howToStart('your portfolio'),

  cta: cta('See your wind portfolio', 'in the', 'Cognitive Twin.'),
} satisfies SectorCopy;
