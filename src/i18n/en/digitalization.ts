import { actions, cta } from './pages-shared';

// /digitalization, from "predicterra-09-digitalization.md". Copy word for word;
// eyebrows left out. For CIO, CDO, digital transformation and data teams.
export default {
  seo: {
    title: 'Cognitive Digital Twin for Energy Operators | Predicterra',
    description:
      'A cognitive digital twin of your assets and the physical world acting on them. Structured, governed and ready for every team, system and AI agent. EU-hosted, on any cloud or on-premises.',
  },
  hero: {
    label: 'Digitalization · Across every sector',
    title: 'A cognitive digital twin of the physical world, ready to consume.',
    text: 'Not a data lake. Not another integration project. Predicterra fuses your systems and thousands of external sources into one living model of your assets, the world acting on them and how everything connects. Ready for every team, every system and every AI agent.',
    primary: actions.demo,
    secondary: actions.platform,
  },
  metrics: [
    { value: '11,000+', text: 'data sources, connected and maintained' },
    { value: '116,000 km', text: 'of UFD’s grid in one ontology' },
    { value: '14 vs 48', text: 'integrations for six asset types and eight use cases' },
    { value: 'Weeks', text: 'for each new use case, not months' },
  ],
  difference: {
    title: 'Your systems generate data. Predicterra gives them a world to run on.',
    columns: ['Data lake', 'Cognitive Twin · Predicterra'],
    rows: [
      {
        label: 'Holds',
        cells: ['Raw data from many systems', 'Your assets, the world around them and the decisions they drive'],
      },
      { label: 'Organized as', cells: ['Tables and files', 'Connected objects with meaning'] },
      { label: 'Answers', cells: ['Whatever someone queries', 'What will happen, why, and what to do'] },
      { label: 'Used by', cells: ['The data team', 'Every team, every system, every AI agent'] },
    ],
    closing: 'Predicterra doesn’t replace your data lake or your twin. It reads them, and makes them cognitive.',
  },
  integrate: {
    title: 'Integrate once. Build on everything.',
    text: 'Six asset types and eight use cases, built one by one, mean 48 integrations. On one ontology, they mean 14. Each system connects once, and your data and innovation teams build new models and applications on top, through the API, on real data from day one.',
    before: { value: '48', text: 'integrations, built one by one' },
    after: { value: '14', text: 'on one ontology' },
  },
  fit: {
    title: 'Fits your architecture. Beats what you’d build.',
    items: [
      { title: 'Open API', text: 'Risk, models and data flow into SCADA, GIS, EAM, ERP, OMS and your data lake.' },
      {
        title: 'Structured risk events',
        text: 'Every prediction becomes an object your systems can consume, with no one translating it by hand.',
      },
      {
        title: 'Any cloud or on-premises',
        text: 'Hosted in the EU and validated on Microsoft Azure, or in your own data center.',
      },
      { title: 'Governed', text: 'Access, lineage and audit trail on every object and every result.' },
      {
        title: 'AI-ready',
        text: 'AI agents need to know what a span is. The ontology gives them context, guardrails and traceability, built around the AI Act.',
      },
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
  cta: cta('Give your systems', 'a world', 'to run on.'),
} as const;
