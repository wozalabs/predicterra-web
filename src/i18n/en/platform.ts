import { actions, cta } from './pages-shared';

// /platform, from "predicterra-02-platform.md". Final copy; section eyebrows left
// out. "Read the methodology" (hero and trust) stays hidden until the PDF exists.
export default {
  seo: {
    title: 'The Cognitive Twin of the Energy System | Predicterra',
    description:
      'The cognitive digital twin of the energy system: simulated physics, a physical ontology and AI in one live model.',
  },

  hero: {
    label: 'Platform',
    titleLine1: 'The Cognitive Twin',
    titleLine2: 'of the energy system.',
    text: 'Predicterra combines simulated physics, a physical ontology and AI in one live model of your energy assets.',
    primary: actions.demo,
  },

  twin: {
    title: 'A new era of energy needs a new kind of twin.',
    text: 'The climate is moving beyond the historical record, regulators ask for proof of resilience, and the energy transition is adding more assets, more connected, in more exposed places. A Cognitive Twin is a live model of your assets, the physical world acting on them and how everything connects. It tells every team what will happen, why, and what to do.',
    columns: ['Descriptive twin', 'Physical twin', 'Cognitive Twin'],
    rows: [
      {
        label: 'Asks',
        cells: ['What do I have, and where?', 'What happens if...?', 'What will happen, why, and what do we do?'],
      },
      {
        label: 'Does',
        cells: [
          'Shows the present.',
          'Answers the scenarios someone asks for.',
          'Reasons over how everything connects, anticipates on its own and explains every answer.',
        ],
      },
    ],
    closing: 'Predicterra is the Cognitive Twin of the energy system.',
  },

  architecture: {
    title: 'Four layers in one model of the world.',
    text: 'A structure for the world, a simulation of its physics, an intelligence that learns it and a coordinate system that pins it to your assets, engineered from the ground up by Woza.',
    layers: [
      {
        title: 'Ontology',
        text: 'Your assets, terrain, hazards and the links between them, held as connected objects, so the model knows a transformer depends on a feeder and that the feeder crosses a floodplain.',
      },
      {
        title: 'Simulated physics',
        text: 'Water and flooding, fire ignition and spread, wind, heat, drought and soil saturation, simulated as forces, so the twin holds under conditions beyond anything in your history.',
      },
      {
        title: 'AI',
        text: 'Models built and calibrated against how your assets actually behave and against their real thresholds, sharper with every new data point.',
      },
      {
        title: 'Geospatial engine',
        text: 'Every prediction resolved in space and time: one asset, one place, one hour.',
      },
    ],
    closing: 'Every output keeps the link to the objects, data and model version that produced it.',
  },

  ontology: {
    title: 'One asset, seen the same way by every team.',
    text: 'The same objects that run the control center also feed the capex plan and the regulator’s report. Take a solar plant on arid, dusty ground, with a heatwave of 46 °C forecast, a climate scenario where events like this are common by 2050, the nearest O&M crew two hours away and the EU Taxonomy criteria it must meet. Predicterra puts these facts, which most organizations keep in five systems, on one graph, so the twin can propose a preventive derate and an inspection and show the relationships behind that call.',
    label: 'One object, its relationships',
    nodes: [
      { label: 'Asset', value: 'Solar plant PV-12' },
      { label: 'Hazard', value: 'Heatwave, 46 °C' },
      { label: 'Environment', value: 'Arid soil, dust' },
      { label: 'Scenario', value: 'SSP2-4.5, 2050' },
      { label: 'Resource', value: 'O&M crew, 2 h away' },
      { label: 'Regulation', value: 'EU Taxonomy' },
    ],
    decision: { label: 'Decision', value: 'Derate and inspect' },
  },

  horizons: {
    title: 'From the next storm to 2100, on the same model.',
    text: 'Operations, planning, risk and compliance read the same model at different distances.',
    labels: { question: 'Question', gets: 'What they get' },
    teams: [
      {
        team: 'Operations',
        horizon: 'Today to 14 days',
        question: 'Which assets will fail, and what do we do first?',
        gets: 'Live risk per asset, alerts, risk rankings, crews and spares in place',
      },
      {
        team: 'Planning',
        horizon: '1 to 10 years',
        question: 'Where should maintenance and capex go?',
        gets: 'Priorities by exposure, hardening, siting',
      },
      {
        team: 'Risk',
        horizon: 'Every horizon',
        question: 'How exposed are we, and what fails with each asset?',
        gets: 'Exposure per hazard, cascading dependencies, expected loss by scenario',
      },
      {
        team: 'Compliance',
        horizon: 'To 2100',
        question: 'Can we prove it, to the regulator and to investors?',
        gets: 'CSRD, EU Taxonomy and CER evidence, resilience plans',
      },
    ],
    closing:
      'Because every horizon runs on the same objects, an asset that tops the ranking every winter shows up in the hardening plan.',
  },

  built: {
    title: 'The planet is already connected, and the models are already built.',
    text: 'Predicterra arrives wired to the world’s observation networks and loaded with models ready to run on your assets.',
    items: [
      {
        value: '11,000+',
        title: 'Data sources, always on',
        text: 'Satellite, weather, climate and terrain feeds from NASA, ESA, Copernicus and meteorological services, fused, held live and maintained for you.',
      },
      {
        value: '30+',
        title: 'Models, ready on day one',
        text: 'Flood, wildfire, wind, heat, drought, soil and vegetation, built for real infrastructure.',
      },
      {
        value: '6',
        title: 'Hazards, one model',
        text: 'The six hazards act together, and the twin models them together, with compound and cascading risk visible in one place.',
      },
    ],
  },

  io: {
    title: 'Start with the data you already run.',
    text: 'Predicterra can start with incomplete data and sharpens as more connects, because each input improves the ontology, the physics, the thresholds and the actions your teams receive.',
    inLabel: 'What goes in',
    outLabel: 'What comes out',
    in: [
      'Asset registry: IDs, types, criticality and maintenance status',
      'Exact locations of lines, substations, plants, pipelines and facilities',
      'Thresholds: heat tolerance, flood exposure, wind limits and access constraints',
      'Incident history: failures, interruptions, inspections and claims',
      'Enterprise systems: SCADA, GIS, EAM, ERP and data lakes',
    ],
    out: [
      'Asset-level risk, per hazard, with severity and confidence',
      'Event impact forecasts, before the event arrives',
      'Cascading dependency maps',
      'Operational actions for inspection, dispatch and planning',
      'Audit-ready evidence for reporting and regulators',
    ],
    note: 'Each prediction becomes a structured object that moves into SCADA, GIS, asset management and planning through an open API. Six asset types and eight use cases, built one by one, mean 48 integrations; on one ontology they mean 14, and every new use case goes live in weeks.',
    code: {
      label: 'risk_event.json',
      json: {
        asset_id: 'substation_42',
        hazard_type: 'flood',
        severity: 'high',
        confidence: 0.91,
        time_window: '2026-02-14T06:00Z/2026-02-14T18:00Z',
        drivers: ['rainfall_72h', 'river_level', 'elevation'],
        downstream_assets: 184,
        recommended_action: 'inspect_and_preposition_crews',
      },
    },
  },

  trust: {
    title: 'Tested against what really happened.',
    items: [
      {
        icon: 'timeline',
        title: 'Backtesting',
        text: 'Models are trained on one period and tested on a separate one, against the operator’s real incidents, up to ten years on distribution networks.',
      },
      {
        icon: 'satellite_alt',
        title: 'Ground truth',
        text: 'Satellite-derived variables, such as vegetation height, are checked against field measurements and LiDAR.',
      },
      {
        icon: 'rule',
        title: 'Standard indices',
        text: 'Climate extremes follow international definitions and open tools, so a third party can reproduce them.',
      },
      {
        icon: 'query_stats',
        title: 'Honest uncertainty',
        text: 'Forecasts show how precision decays with lead time, and climate projections show the range across models.',
      },
    ],
    statement:
      'Built in Europe for critical infrastructure: EU-hosted, on any major cloud or on-premises, explainable by design and ready for CSRD, the EU Taxonomy, the CER Directive and the AI Act.',
    // While the certification is under way, always "in progress". No SOC 2.
    seals: ['GDPR', 'EU-hosted', 'ISO 27001 certification in progress', 'Microsoft Azure Marketplace'],
  },

  cta: cta('Run your energy system', 'on the', 'Cognitive Twin.'),
} as const;
