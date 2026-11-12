import type { SectorCopy } from '../../sections/pages/types';
import { routes } from '../../data/routes';
import { actions, logoBands, howToStart, cta, cases } from './pages-shared';

// /oil-gas, from "predicterra-oil-gas.md". Copy word for word; eyebrows left out.
export default {
  seo: {
    title: 'Physical Risk and Asset Intelligence for Oil & Gas | Predicterra',
    description:
      'The Cognitive Twin for refineries, terminals, pipelines and gas networks. Fire, flood, heat, wind and drought risk per unit and corridor, from the next 14 days to 2100.',
  },

  hero: {
    label: 'Predicterra for Oil & Gas',
    title: 'See what’s coming to every site and pipeline.',
    text: 'Protect sites and pipelines before the fire or flood arrives, plan turnarounds and maintenance around real risk, and give insurers exposure they can price. Wildfire, flood, heat, wind, drought and vegetation on one model of your refineries, terminals and networks, from the next 14 days to 2100.',
    primary: actions.demo,
    secondary: actions.platform,
    visual:
      'Aerial view of a refinery and its tank farm, a coastal LNG terminal and a gas pipeline with its compressor station, running inland along a vegetated corridor. Layers pass (fire, water, heat, wind) and a time control moves from Today to 14 days to 2050.',
    layout: 'split-reverse',
  },

  logos: logoBands.oilGas,

  proof: {
    items: [
      { value: '14 days', text: 'of site-level forecasts' },
      { value: 'To 2100', text: 'climate scenarios for the whole asset life' },
      { value: '30+', text: 'hazard models, ready on day one' },
      { value: '6', text: 'hazards on one model, compound risk included' },
    ],
    backing: {
      text: 'Selected by Moeve for its Light Up program. Proven in operation on 116,000 km of Spanish distribution grid, the kind of network your sites depend on for power.',
      link: cases.all,
    },
  },

  ahead: {
    title: 'Make every stop one you chose.',
    text: 'Refineries, terminals, pipelines and gas networks run around the clock, across long corridors and exposed coastlines. For a site, every day down is a day it isn’t earning. For a network, every hour offline puts security of supply at stake. And as the industry moves toward biofuels, hydrogen and lower-carbon products, the same assets carry more value and more scrutiny.',
    visual: 'Full-bleed photo of a refinery or an LNG terminal at dusk.',
  },

  models: {
    title: 'Every site, every corridor, and everything around them.',
    text: 'Predicterra represents every unit, tank, terminal and pipeline segment as an object in one ontology, linked to the power, water and transport it depends on, and to the forces acting on it.',
    assets: [
      { icon: 'factory', title: 'Refineries and process units', text: 'Risk resolved unit by unit, not by site.' },
      { icon: 'propane_tank', title: 'Tank farms', text: 'Flood, heat and fire exposure around every tank.' },
      {
        icon: 'directions_boat',
        title: 'LNG and oil terminals',
        text: 'Wind, flood and access at the coastline, from jetty to tank.',
      },
      {
        icon: 'route',
        title: 'Pipelines and gas networks',
        text: 'Risk per segment along every corridor, from transmission to distribution.',
      },
      { icon: 'valve', title: 'Compressor and pumping stations', text: 'The nodes the whole line depends on.' },
      { icon: 'gas_meter', title: 'Underground gas storage', text: 'The surface plants that keep supply secure through the winter.' },
      { icon: 'water', title: 'Cooling water and utilities', text: 'The water and power every unit needs to keep running.' },
      {
        icon: 'science',
        title: 'Hydrogen and new energy',
        text: 'Electrolyzers, hydrogen pipelines, biofuels and e-fuels, on the same model.',
      },
    ],
    hazards: ['Wildfire', 'Flood', 'Extreme heat', 'Drought', 'Extreme wind', 'Vegetation along corridors'],
    compound:
      'Compound risk, when they hit together. A heatwave during a drought pushes units toward their limits and strains cooling water at the same time.',
  },

  teams: {
    title: 'One operation. Four teams. The same model.',
    items: [
      {
        name: 'Operations',
        horizon: 'Today to 14 days',
        text: 'Alerts around every site and pipeline segment, with the time window and the recommended action: protect tanks, adjust throughput, position response teams.',
        useCases: [
          { title: 'Wildfire around sites and corridors', text: 'Fire risk at the fence line and along every segment.' },
          { title: 'Flooding of units and tank farms', text: 'Where the water will reach, and what has to stop.' },
          { title: 'Heat and process limits', text: 'When heat pushes units and storage close to their limits.' },
          { title: 'Wind at terminals and jetties', text: 'When loading, berthing and work at height must pause.' },
        ],
        metric: 'Unplanned downtime, incidents avoided',
        shot: 'Platform capture: alerts per unit and segment',
      },
      {
        name: 'Planning and integrity',
        horizon: '1 to 10 years',
        text: 'Turnarounds, maintenance and inspection scheduled around real risk, not the calendar. Protection and adaptation capex where it cuts the most exposure.',
        useCases: [
          { title: 'Vegetation along pipelines', text: 'Right-of-way risk, segment by segment, not by cycle.' },
          { title: 'Turnaround scheduling', text: 'Planned stops placed around real risk windows.' },
          { title: 'Inspection route optimization', text: 'Inspections and crews sent where the risk is highest.' },
        ],
        metric: 'Capex efficiency, maintenance cost',
        shot: 'Platform capture: turnaround calendar with risk',
      },
      {
        name: 'Risk',
        horizon: 'Every horizon',
        text: 'Dependencies on power, cooling water and transport made explicit. Business interruption and expected loss by scenario, with the rigor insurers ask for.',
        useCases: [
          { title: 'Drought and cooling water', text: 'When water stress threatens cooling and throughput.' },
          { title: 'Business interruption and insurance', text: 'Quantified exposure for cover and claims.' },
          {
            title: 'Security of supply',
            text: 'Which segments and stations an event could take offline, and what depends on them.',
          },
        ],
        metric: 'Expected loss, insurance terms',
        shot: 'Platform capture: dependency map of the refinery or network',
      },
      {
        name: 'Compliance',
        horizon: 'To 2100',
        text: 'CSRD physical risk, EU Taxonomy, CER Directive assessments and natural-hazard inputs for safety reports, from the same model.',
        useCases: [{ title: 'Regulatory assessments', text: 'CSRD, EU Taxonomy and CER evidence, site by site.' }],
        metric: 'Hours of reporting saved',
        shot: 'Platform capture: report per site',
      },
    ],
  },

  works: {
    title: 'Your control systems know how your assets run. Predicterra knows what’s coming to them.',
    text: 'Every site and network already runs control systems, historians, maintenance software and integrity records. Predicterra doesn’t replace them. It reads them, adds the forces acting on every unit and segment and the dependencies between them, and sends structured risk events back into the systems your teams already use.',
    reads: [
      'DCS, SCADA, historians and digital twins',
      'Asset registry and pipeline GIS',
      'Maintenance and integrity records',
      'Incident and HSE history',
      'Turnaround and capex plans',
    ],
    returns: [
      'Risk per unit, tank and segment',
      'Event impact forecasts',
      'Alerts with their reasoning',
      'Recommended actions and work windows',
      'Prioritized protection and investment',
    ],
    closing: 'Already run a digital twin of your plant? Predicterra doesn’t replace it. It makes it cognitive.',
  },

  results: {
    title: 'Measured in the numbers your board reads.',
    text: 'We agree the success metric with you before we start, and measure it against your own data.',
    rows: [
      { report: 'Unplanned downtime', change: 'Reduced, measured against your own baseline' },
      { report: 'Throughput lost to weather', change: 'Reduced, measured against your own baseline' },
      { report: 'Business interruption exposure', change: 'Quantified per site and per scenario' },
      { report: 'Insurance terms', change: 'Exposure data insurers can underwrite' },
      { report: 'Time producing climate and compliance reports', change: '95% less' },
    ],
  },

  system: {
    title: 'A refinery runs on more than oil.',
    text: 'Your sites depend on grid power and cooling water, your pipelines share corridors and fire risk with power lines, and your gas feeds the plants that keep the grid balanced. New hydrogen and e-fuel units depend on renewables. In Predicterra they sit in one model, so a risk anywhere in the chain shows up where it lands.',
    center: 'Refinery',
    nodes: [
      { label: 'Grid', href: routes.sectors.grid },
      { label: 'Solar', href: routes.sectors.solar },
      { label: 'Wind', href: routes.sectors.wind },
      { label: 'Cooling water' },
      { label: 'Gas power plant' },
    ],
  },

  start: howToStart('your sites and networks'),

  cta: cta('See your sites and networks', 'in the', 'Cognitive Twin.'),
} satisfies SectorCopy;
