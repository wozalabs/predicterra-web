import { actions, cta, logoBand } from './pages-shared';

// /platform, from "predicterra-02-platform.md". Copy word for word; eyebrows
// left out. "Read the methodology" links stay hidden until the PDF exists.
export default {
  seo: {
    title: 'The Cognitive Twin of the Energy System | Predicterra',
    description:
      'The cognitive digital twin of the energy system. Simulated physics, a physical ontology and AI, from the next storm to 2100.',
  },

  hero: {
    label: 'Platform',
    titleLine1: 'The Cognitive Twin',
    titleLine2: 'of the energy system.',
    text: 'Predicterra runs a living model of your energy assets and the world around them: every force, every asset, every dependency. So every team sees what will happen, why, and what to do first.',
    primary: actions.demo,
    secondary: actions.engineer,
  },

  logos: logoBand,

  twin: {
    title: 'Digital twins learned to see, then to simulate. Now they reason.',
    text: 'A Cognitive Twin is a live model of your assets, the physical world acting on them and how everything connects. It tells every team what will happen, why, and what to do.',
    columns: ['Descriptive twin', 'Physical twin', 'Cognitive Twin'],
    rows: [
      { label: 'Asks', cells: ['What do I have, and where?', 'What happens if...?', 'What will happen, why, and what should we do?'] },
      { label: 'Works', cells: ['When someone looks', 'When someone poses a scenario', 'On its own, and explains every answer'] },
    ],
  },

  architecture: {
    title: 'Simulation, not correlation.',
    layers: [
      {
        index: '01',
        title: 'Ontology',
        text: 'Your assets, terrain, hazards and the links between them, held as connected objects.',
      },
      {
        index: '02',
        title: 'Simulated physics',
        text: 'Flood, fire, wind, heat and drought, simulated as forces, not guessed from history.',
      },
      {
        index: '03',
        title: 'AI',
        text: 'Calibrated on how your assets actually behave. AI calibrates the physics; it doesn’t replace it.',
      },
      { index: '04', title: 'Geospatial engine', text: 'Every answer resolved to one asset, one place, one hour.' },
    ],
    figures: [
      { value: '11,000+', text: 'data sources, connected and maintained' },
      { value: '30+', text: 'hazard models, ready on day one' },
      { value: '6', text: 'hazards on one model, compound risk included' },
    ],
  },

  io: {
    title: 'It reads the systems you run. It returns decisions.',
    reads: [
      'Asset registry and GIS',
      'Thresholds and asset limits',
      'Incident history',
      'SCADA, EAM, ERP and data lakes',
      'Inspections, LiDAR and field surveys',
    ],
    returns: [
      'Asset-level risk, per hazard',
      'Event impact forecasts',
      'Cascading dependency maps',
      'Operational actions',
      'Audit-ready evidence',
    ],
    readsLabel: 'Reads',
    returnsLabel: 'Returns',
    integrations:
      'Six asset types and eight use cases, built one by one, mean 48 integrations. On one ontology, they mean 14.',
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

  validation: {
    title: 'Tested against what really happened.',
    items: [
      {
        title: 'Backtesting',
        text: 'Trained on one period and tested on another it never saw, against real incidents. Up to ten years on distribution networks.',
      },
      {
        title: 'Ground truth',
        text: 'Satellite-derived variables, such as vegetation height, checked against field measurements and LiDAR.',
      },
      {
        title: 'Honest uncertainty',
        text: 'Forecasts show how precision decays with lead time. Climate projections show the range across models, not one convenient number.',
      },
    ],
  },

  trust: {
    title: 'Built in Europe. Built for critical infrastructure.',
    items: [
      {
        icon: 'lock',
        title: 'Your cloud, your perimeter',
        text: 'Any major cloud or on-premises, hosted in the EU. Critical data never leaves your perimeter.',
      },
      {
        icon: 'fact_check',
        title: 'Explainable',
        text: 'Every prediction traced to the assets, data and model version behind it.',
      },
      {
        icon: 'gavel',
        title: 'Ready for European regulation',
        text: 'Designed around CSRD, the EU Taxonomy, the CER Directive and the AI Act.',
      },
      {
        icon: 'lock_open',
        title: 'Vendor-neutral',
        text: 'Works with any GIS, SCADA, EAM or cloud. Your data leaves through an open API whenever you want.',
      },
    ],
    seals: ['GDPR', 'EU-hosted', 'ISO 27001 certification in progress', 'Microsoft Azure Marketplace'],
  },

  cta: cta('Run your energy system', 'on the', 'Cognitive Twin.'),
} as const;
