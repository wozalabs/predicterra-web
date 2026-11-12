import { routes } from '../../data/routes';
import { actions, logoBands, howToStart, cta } from './pages-shared';

// /digitalization, from "predicterra-digitalization.md". Copy word for word; eyebrows left out.
export default {
  seo: {
    title: 'Cognitive Digital Twin for Energy Operators | Predicterra',
    description:
      'A cognitive digital twin of your assets and the physical world acting on them. Structured, governed and ready for every team, system and AI agent. EU-hosted, on any cloud or on-premises.',
  },

  hero: {
    label: 'Digitalization · Across every sector',
    title: 'A cognitive digital twin of the physical world, ready to consume.',
    text: 'Not a data lake. Not another integration project. Predicterra fuses your systems and thousands of external sources into a Cognitive Twin: one living model that understands your assets, the world acting on them and how everything connects. Ready for every team, every system and every AI agent.',
    primary: actions.demo,
    secondary: actions.platform,
    inputs: ['SCADA', 'GIS', 'EAM', 'Satellite', 'Weather', 'Incidents'],
    outputs: ['Systems', 'Teams', 'AI agents'],
    visual:
      'Fusion animation: loose data streams enter as thin lines, are ordered into a graph of connected objects over the territory, and leave as structured events towards systems and teams.',
  },

  logos: logoBands.standard,

  proof: {
    items: [
      { value: '11,000+', text: 'data sources, connected and maintained' },
      { value: '116,000 km', text: 'of UFD’s grid in one ontology' },
      { value: '14 vs 48', text: 'integrations for six asset types and eight use cases' },
      { value: 'Weeks', text: 'for each new use case, not months' },
    ],
  },

  ahead: {
    title: 'The energy system is going digital. The physical world has to come with it.',
    text: 'Operators are investing in data platforms, digital twins and AI. Europe has asked its grid operators for a digital twin of the European electricity grid. But most models still describe the assets and leave out the world around them: the weather, the terrain, the vegetation, the dependencies with other sectors. An inventory is no longer enough: the data has to model the world the assets live in.',
    sources: 'Source: EU Action Plan for the Digitalisation of the Energy System (ENTSO-E and EU DSO Entity).',
    // Top to bottom, as drawn: the climate over the terrain over the assets.
    layers: ['Climate', 'Terrain', 'Assets'],
  },

  cognitive: {
    title: 'Digital twins learned to see, then to simulate. Now they reason.',
    text: 'Most digital twins describe what you have, or simulate what happens when an engineer asks. A Cognitive Twin is a live model of your assets, the physical world acting on them and how everything connects. It tells every team what will happen, why, and what to do.',
    subtitle: 'What makes it cognitive',
    items: [
      {
        icon: 'account_tree',
        title: 'It reasons over relationships',
        text: 'It knows which feeder a transformer depends on, that the feeder crosses a floodplain, and which plant goes dark if it fails.',
      },
      {
        icon: 'radar',
        title: 'It anticipates on its own',
        text: 'It doesn’t wait for someone to pose the scenario. It prioritizes what matters, from the next 14 days to 2100.',
      },
      {
        icon: 'fact_check',
        title: 'It explains every answer',
        text: 'Every result is tied to the objects, relationships and data behind it, so it can be audited step by step.',
      },
    ],
    closing:
      'Cognitive doesn’t mean a chat window. It means a model that understands how the physical world connects. Predicterra is the Cognitive Twin of the energy system.',
    link: { label: 'Explore the platform', href: routes.platform },
  },

  lake: {
    title: 'Your systems generate data. Predicterra gives them a world to run on.',
    columns: ['Data lake', 'Physical twin', 'Cognitive Twin · Predicterra'],
    rows: [
      {
        label: 'Holds',
        cells: [
          'Raw data from many systems',
          'One network and its physics',
          'The assets, the world around them and the decisions they drive',
        ],
      },
      { label: 'Organized as', cells: ['Tables and files', 'Geometry and physics', 'Connected objects with meaning'] },
      { label: 'Time', cells: ['The past', 'The scenarios you ask for', 'Live, from the next 14 days to 2100'] },
      { label: 'Answers', cells: ['Whatever someone queries', 'What happens if...?', 'What will happen, why, and what to do'] },
      { label: 'Used by', cells: ['The data team', 'Engineers', 'Every team, every system, every AI agent'] },
    ],
    closing: 'Predicterra doesn’t replace your data lake or your twin. It reads them, and makes them cognitive.',
  },

  built: {
    title: 'One model, from a single asset to the whole region.',
    scales: ['Asset', 'Network', 'Region'],
    items: [
      {
        icon: 'database',
        title: 'Ingest at source',
        text: 'Data is read as close to its origin as possible, without long ETL chains that add delay and errors.',
      },
      {
        icon: 'schema',
        title: 'One ontology',
        text: 'Every asset keeps its ID from your systems and gains its relationships: what feeds it, what it feeds, what threatens it.',
      },
      {
        icon: 'public',
        title: 'A simulated world, as a service',
        text: 'Not a snapshot that goes stale. A live simulation of the forces acting on your assets, updated continuously and served to your systems.',
      },
      {
        icon: 'layers',
        title: 'Every scale',
        text: 'The same reality resolved for one transformer, a whole network and the region around it.',
      },
      {
        icon: 'link',
        title: 'Traceable',
        text: 'Every output keeps the link to the objects, data and model version behind it.',
      },
    ],
  },

  integrate: {
    title: 'Every new use case runs on the same model.',
    text: 'Six asset types and eight use cases, built one by one, mean 48 integrations. On one ontology, they mean 14. Each system connects once, and every new use case reuses everything already there. That’s why it goes live in weeks, and why the model gets better with every sector you add.',
  },

  ai: {
    title: 'AI agents need to know what a span is.',
    text: 'A language model doesn’t know what a span, a transformer or an electrolyzer is, or how they depend on each other. A Cognitive Twin does. Its ontology gives AI agents that context, limits their actions to real objects, and records what every proposal is based on. So AI can work on your infrastructure with the traceability your regulators will ask for.',
    items: [
      { icon: 'hub', title: 'Context', text: 'Agents reason over real objects and relationships, not loose tables.' },
      { icon: 'rule', title: 'Guardrails', text: 'Actions are limited to the assets and decisions the ontology defines.' },
      {
        icon: 'policy',
        title: 'Traceability',
        text: 'Every proposal shows the data, objects and model behind it, built around the AI Act’s requirements for critical infrastructure.',
      },
    ],
    visual:
      'Mock-up of a panel: a natural-language question (“Which substations in the north are at flood risk this week, and what depends on them?”), the answer ordered by asset, and the objects and sources behind it as chips. Footnote: Mock-up for illustration.',
  },

  fit: {
    title: 'Fits your architecture. Beats what you’d build.',
    text: 'Predicterra connects through open APIs and deploys into the architecture you already run. It’s the physical-data platform your team would spend years building, running in weeks.',
    items: [
      { title: 'Open API', text: 'Risk, models and data flow into SCADA, GIS, EAM, ERP, OMS and your data lake.' },
      {
        title: 'Structured risk events',
        text: 'Every prediction becomes an object your systems can consume, with no one translating it by hand.',
      },
      {
        title: 'Any cloud or on-premises',
        text: 'Deploy wherever your security and sovereignty policies say. Hosted in the EU, validated on Microsoft Azure.',
      },
      { title: 'Governed', text: 'Access, lineage and audit trail on every object and every result.' },
    ],
    code: {
      label: 'risk_event.json',
      json: {
        asset_id: 'pumping_station_07',
        hazard_type: 'wildfire',
        severity: 'high',
        confidence: 0.88,
        time_window: '2026-08-03T10:00Z/2026-08-03T22:00Z',
        drivers: ['fire_weather_index', 'fuel_dryness', 'wind_speed'],
        downstream_assets: 23,
        recommended_action: 'protect_perimeter_and_preposition_team',
      },
    },
  },

  build: {
    title: 'We built the foundation. You build on it.',
    text: 'Every new project usually starts by rebuilding the same base: the data, the models, the geospatial layer. With Predicterra it’s already running. Your data and innovation teams build new models, early warnings and applications on top, through the API, on real data from day one.',
    items: [
      { title: 'The data', text: 'Satellite, weather and climate sources, connected and maintained.' },
      { title: 'The ontology', text: 'Your assets and their dependencies, as connected objects.' },
      { title: 'The geospatial engine', text: 'Every result resolved to one asset, one place, one time.' },
      { title: 'The models', text: '30+ hazard models, ready to extend.' },
    ],
    apps: ['New models', 'Early warnings', 'Applications'],
  },

  start: howToStart('your systems'),

  cta: cta('Give your systems', 'a world', 'to run on.'),
} as const;
