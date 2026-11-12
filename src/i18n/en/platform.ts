import { actions, logoBands, cta, cases } from './pages-shared';
import { external } from '../../data/routes';

// /platform, from "predicterra-platform.md". Copy word for word; eyebrows left out.
export default {
  seo: {
    title: 'The Cognitive Twin of the Energy System | Predicterra',
    description:
      'The cognitive digital twin of the energy system. Simulated physics, a physical ontology and AI, from the next storm to 2100.',
  },

  hero: {
    label: 'Platform',
    title: 'The Cognitive Twin of the energy system.',
    text: 'Predicterra runs a living model of your energy assets and the world around them: every force, every asset, every dependency. So every team sees what will happen, why, and what to do first.',
    primary: actions.demo,
    secondary: actions.methodology,
    visual:
      'Full-width animation of the living model: a territory with a power grid, a solar plant and a gas pipeline. Layers light up one at a time on the same terrain, each with its label.',
    layers: [
      { name: 'Water', text: 'Flood flow and terrain exposure', icon: 'water_drop' },
      { name: 'Fire', text: 'Ignition and spread pressure', icon: 'local_fire_department' },
      { name: 'Heat', text: 'Stress on assets and operations', icon: 'thermostat' },
      { name: 'Terrain', text: 'Spatial context down to the asset', icon: 'layers' },
    ],
  },

  logos: logoBands.standard,

  era: {
    title: 'A new era of energy needs a new kind of twin.',
    text: 'The climate no longer repeats itself. Regulators ask for proof of resilience, not promises. And the transition is adding more assets, more connected, in more exposed places. Digital twins have evolved to meet it: first they learned to see, then to simulate. Now they reason.',
    columns: ['Descriptive twin', 'Physical twin', 'Cognitive Twin'],
    rows: [
      { label: 'Asks', cells: ['What do I have, and where?', 'What happens if...?', 'What will happen, why, and what do we do?'] },
      {
        label: 'Is',
        cells: [
          'An inventory of your assets, in 2D or 3D.',
          'Physics applied to one network.',
          'Physics, ontology and AI across the whole energy system.',
        ],
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
    closing:
      'A Cognitive Twin is a live model of your assets, the physical world acting on them and how everything connects. It tells every team what will happen, why, and what to do. Predicterra is the Cognitive Twin of the energy system.',
    support: 'Cognitive doesn’t mean a chat window. It means a model that understands how the physical world connects.',
  },

  simulation: {
    title: 'Simulation, not correlation.',
    text: [
      'A statistical model asks: given a past like this, what usually happens? A simulation asks: given the state of the world right now, what happens next?',
      'When conditions move past anything in the record, correlation breaks. Physics holds, because it doesn’t care whether something has happened before. Only which forces are in play.',
    ],
    columns: [
      { name: 'Correlation', text: 'Memorizes the past. Breaks outside the record.' },
      { name: 'Simulation', text: 'Understands the forces. Predicts what happens next.' },
    ],
    chart: { band: 'Historical range', line: 'Past range ≠ future state' },
    closing: 'AI calibrates the physics to your assets. It doesn’t replace it.',
  },

  architecture: {
    title: 'Four layers. One model of the world.',
    text: 'A structure for the world, a simulation of its physics, an intelligence that learns it, and a coordinate system that pins it to your assets. Engineered from the ground up by Woza.',
    layers: [
      {
        name: 'Ontology',
        title: 'The world as a graph, not a table.',
        text: 'Your assets, terrain, hazards and the links between them, held as connected objects. The model knows a transformer depends on a feeder, and that the feeder crosses a floodplain. Risk moves through it the way it moves through the real network.',
        tag: 'graph.entities + relationships',
      },
      {
        name: 'Simulated physics',
        title: 'A living twin, driven by physics.',
        text: 'Water and flooding, fire ignition and spread, wind, heat, drought and soil saturation, simulated as forces. That’s why the twin holds under conditions your history never contained.',
        tag: 'physics.force_fields + boundary_conditions',
      },
      {
        name: 'AI',
        title: 'Intelligence that learns your assets.',
        text: 'Models are built and calibrated against how your assets actually behave, and against their real thresholds. Every new data point makes them sharper.',
        tag: 'model.calibration + feedback_loop',
      },
      {
        name: 'Geospatial engine',
        title: 'Pinned down to the asset.',
        text: 'Every prediction resolved in space and time: one asset, one place, one hour. Risk becomes a coordinate you act on, not a heat map you interpret.',
        tag: 'geo.coordinates + asset_resolution',
      },
    ],
    trace: 'Traceable end to end. Every output keeps the link to the objects, data and model version that produced it.',
    builtBy: { label: 'Built by Woza', href: external.woza },
  },

  ontology: {
    title: 'One asset. One reality. Every team.',
    text: [
      'The same objects that run the control center also feed the capex plan and the regulator’s report. Here is one of them.',
      'A solar plant on arid, dusty ground. A heatwave forecast of 46 °C. A climate scenario where events like this are common by 2050. The nearest O&M crew, two hours away. The EU Taxonomy criteria the plant must meet.',
      'In most organizations, these facts live in five systems. In Predicterra they sit on one graph. So the twin proposes a preventive derate and an inspection, and shows the relationships behind that call.',
    ],
    center: { label: 'Asset', value: 'Solar plant PV-12' },
    nodes: [
      { label: 'Hazard', value: 'Heatwave, 46 °C' },
      { label: 'Environment', value: 'Arid soil, dust' },
      { label: 'Scenario', value: 'SSP2-4.5, 2050' },
      { label: 'Resource', value: 'O&M crew, 2 h away' },
      { label: 'Regulation', value: 'EU Taxonomy' },
      { label: 'Decision', value: 'Derate and inspect' },
    ],
    closing:
      'It’s also what lets AI agents work on real infrastructure: they reason over objects with meaning, and every proposal shows what it stands on.',
  },

  horizons: {
    title: 'From the next storm to 2100. On the same model.',
    text: 'Operations, planning, risk and compliance don’t need four tools. They need the same model, read at different distances.',
    teams: [
      {
        name: 'Operations',
        horizon: 'Today to 14 days',
        question: 'Which assets will fail, and what do we do first?',
        gets: 'Live risk per asset, alerts, risk rankings, crews and spares in place',
      },
      {
        name: 'Planning',
        horizon: '1 to 10 years',
        question: 'Where should maintenance and capex go?',
        gets: 'Priorities by exposure, hardening, siting',
      },
      {
        name: 'Risk',
        horizon: 'Every horizon',
        question: 'How exposed are we, and what fails with each asset?',
        gets: 'Exposure per hazard, cascading dependencies, expected loss by scenario',
      },
      {
        name: 'Compliance',
        horizon: 'To 2100',
        question: 'Can we prove it, to the regulator and to investors?',
        gets: 'CSRD, EU Taxonomy and CER evidence, resilience plans',
      },
    ],
    closing:
      'Because every horizon runs on the same objects, they agree. An asset that tops the ranking every winter shows up in the hardening plan. If it doesn’t, the twin tells you.',
  },

  ready: {
    title: 'The planet is already connected. The models are already built.',
    text: 'Predicterra doesn’t arrive as an empty engine. It arrives wired to the world’s observation networks and loaded with models ready to run on your assets.',
    items: [
      {
        value: '11,000+',
        title: 'Data sources, always on',
        text: 'Satellite, weather, climate and terrain feeds from NASA, ESA, Copernicus and meteorological services, fused and held live. Your team never builds a data pipeline.',
      },
      {
        value: '30+',
        title: 'Models, ready on day one',
        text: 'Flood, wildfire, wind, heat, drought, soil and vegetation, built for real infrastructure. Not scoped and rebuilt per project.',
      },
      {
        value: '6',
        title: 'Hazards, one model',
        text: 'They act together, and so does the twin. Compound and cascading risk, visible in one place.',
      },
    ],
    maps: ['Flood', 'Wildfire', 'Heat', 'Wind'],
  },

  inputs: {
    title: 'Start with the data you already run.',
    text: 'Predicterra can start with incomplete data and sharpen as more connects. Each input improves the ontology, the physics, the thresholds and the actions your teams receive.',
    items: [
      {
        tag: 'asset_registry',
        text: 'Asset IDs, types, ownership, criticality, maintenance status and operational metadata.',
      },
      {
        tag: 'geo_coordinates',
        text: 'Exact locations of lines, corridors, substations, plants, pipelines and facilities.',
      },
      {
        tag: 'thresholds',
        text: 'Heat tolerance, flood exposure, wind limits, access constraints and outage sensitivity.',
      },
      {
        tag: 'incident_history',
        text: 'Failures, interruptions, inspections, claims, near misses and known weak points.',
      },
      { tag: 'enterprise_systems', text: 'SCADA, GIS, EAM, ERP, data lakes and planning systems.' },
    ],
    states: ['incomplete', 'connected', 'calibrated'],
    integrate: {
      title: 'Integrate once. Build on everything.',
      text: 'Six asset types and eight use cases, built one by one, mean 48 integrations. On one ontology, they mean 14. Every new use case reuses the same model, so it goes live in weeks, not months.',
    },
  },

  outputs: {
    title: 'Risk your teams can act on, not just read.',
    items: [
      {
        icon: 'warning',
        title: 'Asset-level risk, per hazard',
        text: 'Every hazard resolved to the assets it threatens, with severity and confidence.',
      },
      {
        icon: 'thunderstorm',
        title: 'Event impact forecasts',
        text: 'What an incoming event is likely to do to your assets, before it arrives.',
      },
      {
        icon: 'account_tree',
        title: 'Cascading dependency maps',
        text: 'What sits downstream of each exposed asset, feeder, site or zone.',
      },
      {
        icon: 'task',
        title: 'Operational actions',
        text: 'Inspection, dispatch, planning and control-room decisions, straight from the model.',
      },
      { icon: 'api', title: 'API-ready model data', text: 'Risk events, thresholds, assets and time windows pushed into your systems.' },
      {
        icon: 'fact_check',
        title: 'Audit-ready evidence',
        text: 'A clear record of exposure, model reasoning and response, for reporting and regulators.',
      },
    ],
    event: {
      title: 'A risk event your systems can consume',
      text: 'Each prediction becomes a structured object that moves into SCADA, GIS, asset management and planning, with no one translating it by hand.',
      label: 'risk_event.json · live output',
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
        text: 'Models are trained on one period and tested on another they never saw, against the operator’s real incidents. Up to ten years on distribution networks.',
      },
      {
        title: 'Ground truth',
        text: 'Satellite-derived variables, such as vegetation height, are checked against field measurements and LiDAR.',
      },
      {
        title: 'Standard indices',
        text: 'Climate extremes follow international definitions and open tools, so a third party can reproduce them.',
      },
      {
        title: 'Honest uncertainty',
        text: 'Forecasts show how precision decays with lead time. Climate projections show the range across models, not one convenient number.',
      },
    ],
    // Destination still to define (a downloadable methodology PDF).
    link: { label: 'Read the methodology', href: '#validation' },
  },

  trust: {
    title: 'Built in Europe. Built for critical infrastructure.',
    text: 'Energy data is critical infrastructure. Predicterra treats it that way.',
    items: [
      {
        title: 'Your cloud, your perimeter',
        text: 'Deploy on any major cloud or on-premises. Hosted in the EU and validated on Microsoft Azure. Critical data never leaves your perimeter.',
      },
      {
        title: 'An API that connects to everything',
        text: 'Risk, models and data flow straight into the SCADA, GIS, asset and enterprise systems you already run.',
      },
      { title: 'Explainable by design', text: 'Every prediction traced to the assets, data and models behind it.' },
      {
        title: 'Ready for European regulation',
        text: 'Designed around CSRD, the EU Taxonomy, the CER Directive and the AI Act.',
      },
      {
        title: 'Vendor-neutral',
        text: 'Works with any GIS, SCADA, EAM or cloud, whoever built it. No vendor decides which systems you can connect.',
      },
    ],
    open: {
      title: 'Open by design.',
      text: 'Open interfaces, standard formats and your data always within reach. You choose what connects to Predicterra, not the other way round.',
    },
    seals: ['GDPR', 'EU-hosted', 'ISO 27001 certification in progress', 'Microsoft Azure Marketplace'],
    perimeter: { label: 'Your cloud', systems: ['SCADA', 'GIS', 'EAM', 'ERP'] },
  },

  proof: {
    title: 'In operation today.',
    text: 'Two of Spain’s largest distribution networks already use Predicterra.',
    cards: [
      {
        client: 'i-DE (Iberdrola)',
        value: '73%',
        label: 'faster response to climate events',
        text: 'Span-level risk across 85,000 km of overhead lines. Crews in place before the storm hits.',
        badge: 'PERSEO challenge winner',
        link: { label: 'Read the case', href: cases.ide.href },
        logo: { src: '/logos/iberdrola.svg', w: 109, h0: 27, h: 22 },
      },
      {
        client: 'UFD (Naturgy)',
        value: '116,000 km',
        label: 'of grid in one model',
        text: 'Asset-level risk up to 14 days ahead, validated against ten years of real incidents.',
        badge: 'E.DSO success case',
        link: { label: 'Read the case', href: cases.ufd.href },
        logo: { src: '/logos/ufd.svg', w: 848, h0: 512, h: 34 },
      },
    ],
    ecosystem:
      'Available on Microsoft Azure Marketplace · Member of Iberdrola’s Global Smart Grids Innovation Hub and FutuRed · Winner of Iberdrola PERSEO and BIND 4.0',
  },

  cta: cta('Run your energy system', 'on the', 'Cognitive Twin.'),
} as const;
