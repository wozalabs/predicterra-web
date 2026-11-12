import type { SectorCopy } from '../../sections/pages/types';
import { routes } from '../../data/routes';
import { actions, logoBands, howToStart, cta, cases } from './pages-shared';

// /grid, from "predicterra-grid.md". Copy word for word; eyebrows left out.
export default {
  seo: {
    title: 'Grid Resilience and Asset Intelligence for DSOs and TSOs | Predicterra',
    description:
      'The Cognitive Twin for transmission and distribution networks. Fire, flood, wind, heat and vegetation risk per span and substation, from the next 14 days to 2100.',
  },

  hero: {
    label: 'Predicterra for Grid',
    title: 'See what’s coming to every span and substation.',
    text: 'Put crews in place before the storm, invest in hardening where it cuts the most risk, and give the regulator evidence it can follow. Vegetation, wind, wildfire, flood and heat on one model of your network, from the next 14 days to 2100.',
    primary: actions.demo,
    secondary: actions.platform,
    visual:
      'Animated map of a distribution network on the terrain: lines, poles and substations with risk per span on a colour scale. Layers pass one by one (fire, water, wind, heat) and a time control moves from Today to 14 days to 2050.',
    layout: 'stack',
  },

  logos: logoBands.grid,

  proof: {
    items: [
      { value: '73%', text: 'faster response to climate events at i-DE', link: cases.ide },
      { value: '116,000 km', text: 'of UFD’s grid in one model', link: cases.ufd },
      { value: '14 days', text: 'of asset-level forecasts' },
      { value: '10 years', text: 'of real incidents backtested' },
    ],
  },

  ahead: {
    title: 'Grids are being asked to do more than ever.',
    text: 'Connect more renewables. Power new demand, from electrification to data centers. Stay up through harsher weather, and prove it to the regulator. Every one of those demands lands on the same spans and substations.',
    figures: [
      { value: '€1.2 trillion', text: 'needed in EU electricity grids by 2040' },
      { value: '400,000+ ha', text: 'burned in Spain in 2025, the worst year in three decades' },
      { value: '~180,000', text: 'customers left without power by the 2024 Valencia floods' },
    ],
    sources: 'Sources: European Commission (European Grids Package); official 2025 wildfire data; Iberdrola / i-DE.',
    visual: 'Full-bleed photo of a distribution line in a forest landscape.',
  },

  models: {
    title: 'Your whole network, and everything around it.',
    text: 'Predicterra represents every asset as an object in one ontology, linked to what feeds it, what it feeds, and the forces acting on it.',
    assets: [
      { icon: 'polyline', title: 'Lines and spans', text: 'Risk resolved span by span, not by region.' },
      { icon: 'cable', title: 'Poles and towers', text: 'Exposure and condition, tied to the line they hold.' },
      { icon: 'account_tree', title: 'Feeders', text: 'Every customer and asset that depends on them.' },
      { icon: 'hub', title: 'Substations', text: 'Flood depth, heat and access, with everything downstream.' },
      { icon: 'electric_bolt', title: 'Transformers', text: 'Thermal stress and the load behind it.' },
      { icon: 'groups', title: 'Control center and field crews', text: 'Events, crews and decisions, on the same model.' },
    ],
    hazards: ['Vegetation', 'Extreme wind', 'Wildfire', 'Flood', 'Extreme heat', 'Drought'],
    compound:
      'Compound risk, when they hit together. Drought and wind are what turn vegetation near a line into an ignition risk.',
  },

  teams: {
    title: 'One grid. Four teams. The same model.',
    items: [
      {
        name: 'Operations',
        horizon: 'Today to 14 days',
        text: 'Every span ranked by failure risk, with the reason and the time window.',
        useCases: [
          { title: 'Storm and wind impact', text: 'Which spans and poles will fail, and when.' },
          { title: 'Wildfire ignition', text: 'Where your lines could start a fire, and when to act.' },
          { title: 'Substation flooding', text: 'Where the water will reach, and what goes dark with it.' },
          { title: 'Heat and thermal stress', text: 'Conductors and transformers running close to their thermal limits.' },
          { title: 'Crew pre-positioning', text: 'Crews and spares where the event will hit.' },
          {
            title: 'Preventive de-energization',
            text: 'Plan it circuit by circuit before the event, with the reasoning attached.',
          },
        ],
        metric: 'Response time, interruptions avoided (TIEPI, NIEPI)',
        shot: 'Platform capture: span ranking',
      },
      {
        name: 'Planning and asset management',
        horizon: '1 to 10 years',
        text: 'Vegetation, maintenance, hardening and undergrounding prioritized by real exposure, not by calendar.',
        useCases: [
          { title: 'Vegetation risk', text: 'Trimming by risk, span by span, not by cycle.' },
          { title: 'Maintenance priorities', text: 'Inspections ranked by real exposure.' },
          { title: 'Hardening and undergrounding', text: 'Reinforcement where it cuts the most risk.' },
        ],
        metric: 'Capex efficiency, risk reduced per euro',
        shot: 'Platform capture: investment priority map',
      },
      {
        name: 'Risk',
        horizon: 'Every horizon',
        text: 'Exposure and consequences for every asset, from today to 2100.',
        useCases: [
          {
            title: 'Cascading dependencies',
            text: 'Which feeders, customers and plants depend on each asset, and what fails with it.',
          },
          { title: 'Expected loss', text: 'The cost of doing nothing, by scenario.' },
        ],
        metric: 'Expected loss, critical dependencies',
        shot: 'Platform capture: cascading dependency map',
      },
      {
        name: 'Regulation and compliance',
        horizon: 'To 2100',
        text: 'Quality-of-supply evidence, resilience plans and CER and CSRD reporting, from the same model.',
        useCases: [
          { title: 'Resilience investment cases', text: 'Capex justified with exposure to 2050.' },
          { title: 'Regulatory reporting', text: 'Evidence for the regulator, from the model you operate.' },
        ],
        metric: 'Hours of reporting saved',
        shot: 'Platform capture: report with charts',
      },
    ],
  },

  works: {
    title: 'Your twin knows your network. Predicterra knows what’s coming to it.',
    text: 'Many operators already run a GIS, LiDAR and vegetation surveys, or their own 3D digital twin. Predicterra reads them, adds the forces acting on every asset and the dependencies between them, and sends structured risk events back into the systems your teams already use.',
    extra: 'Vegetation analytics tells you where the trees are. Predicterra tells you which span fails when the wind reaches them.',
    reads: [
      'GIS and asset registry',
      'LiDAR, 3D models and vegetation surveys',
      'SCADA, ADMS and OMS',
      'Incident and outage history',
      'EAM and capex plans',
    ],
    returns: [
      'Risk per span, pole and substation',
      'Event impact forecasts',
      'Structured risk events',
      'Recommended actions',
      'Prioritized work and investment',
    ],
    closing: 'It doesn’t replace your twin. It makes it cognitive.',
  },

  results: {
    title: 'Measured in the numbers you already report.',
    text: 'We agree the success metric with you before we start, and measure it against your own incidents.',
    rows: [
      { report: 'Response time to climate events', change: '73% faster at i-DE' },
      { report: 'Interruption duration (TIEPI, SAIDI)', change: 'Measured per zone in your deployment' },
      { report: 'Interruption frequency (NIEPI, SAIFI)', change: 'Measured per zone in your deployment' },
      { report: 'Outage costs', change: '€2.1M a year avoided' },
      { report: 'Time producing climate and compliance reports', change: '95% less' },
    ],
  },

  system: {
    title: 'The grid is the spine of the energy system.',
    text: 'Your substations carry the output of solar and wind plants, and feed refineries, electrolyzers and data centers. In Predicterra they share one model, so a risk on the grid shows up wherever it lands.',
    center: 'Grid',
    nodes: [
      { label: 'Solar', href: routes.sectors.solar },
      { label: 'Wind', href: routes.sectors.wind },
      { label: 'Oil & Gas', href: routes.sectors.oilGas },
      { label: 'Data centers' },
    ],
  },

  start: {
    ...howToStart('your network'),
    // The buyer's guide still has to be written: the block stays hidden until ready is true.
    guide: {
      ready: false,
      text: 'Preparing a grid resilience tender? Download our buyer’s guide.',
      link: { label: 'Download the guide', href: routes.contact },
    },
  },

  cta: cta('See your network', 'in the', 'Cognitive Twin.'),
} satisfies SectorCopy;
