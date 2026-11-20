import { routes } from '../../data/routes';
import { actions } from './pages-shared';

// /solution: the one Solution page (from "predicterra-the-solution.html"),
// replacing the seven earlier Solutions pages (sectors and across all sectors).
// Section ids are the anchors the rest of the site links to (data/routes.ts).
export default {
  seo: {
    title: 'The solution | Predicterra',
    description:
      'One Cognitive Twin for the energy operation, connecting assets, data and teams across grid, solar, wind and oil & gas.',
  },

  hero: {
    title: 'One Cognitive Twin for your entire energy operation.',
    text: 'Predicterra connects your assets, data and teams in one living model of the physical world, so the whole organization can see what is happening, anticipate what comes next and act together.',
    primary: actions.demo,
    secondary: actions.engineer,
  },

  challenge: {
    title: 'A connected operation needs a shared picture.',
    text: 'Asset, weather, satellite and incident data often live in separate tools, so teams see different parts of the same operation and struggle to connect daily decisions with long-term plans.',
    items: [
      { title: 'Scattered information', text: 'Different sources and tools, with no consistent view of each asset.' },
      { title: 'Disconnected teams', text: 'Operations, planning and reporting working from separate perspectives.' },
      { title: 'Different time horizons', text: 'Immediate conditions and future scenarios assessed separately.' },
    ],
  },

  capabilities: {
    title: 'One model, from data to action.',
    text: 'Predicterra combines your asset data with the physical forces around it, then turns that shared picture into decisions for every team.',
    steps: [
      {
        title: 'See',
        text: 'Your assets, your network and the world around them in one live model, built from your own systems plus satellite, weather and climate data.',
      },
      {
        title: 'Anticipate',
        text: 'Water, fire, wind, heat and soil simulated on each asset, from the coming days to 2100.',
      },
      {
        title: 'Decide',
        text: 'What to do first, ranked by the risk each action removes: crews, inspections, hardening or investment.',
      },
      {
        title: 'Prove',
        text: 'Every result keeps its data and model, ready for the regulator, an auditor or the board.',
      },
    ],
    teamsTitle: 'One shared model for every team',
    teams: [
      { title: 'Operations', text: 'Live conditions and the next action.' },
      { title: 'Maintenance and planning', text: 'Priorities for crews, upgrades and investment.' },
      { title: 'Risk and resilience', text: 'Exposure per asset across scenarios.' },
      { title: 'Sustainability and compliance', text: 'Traceable evidence for reporting.' },
      { title: 'IT and data', text: 'One model connected to the systems you already run.' },
    ],
  },

  difference: {
    title: 'A wider view than a single-purpose tool.',
    text: 'Specialist tools solve important problems, and Predicterra connects asset intelligence, physical conditions and operational decisions in one model across the whole operation.',
    columns: ['Satellite intelligence', 'Network digital twin', 'Predicterra Cognitive Twin'],
    rows: [
      { label: 'Main focus', cells: ['Vegetation and events', 'Network behavior', 'The wider operation'] },
      { label: 'Core method', cells: ['Satellite data and AI', '3D models and physics', 'Asset data, physical simulation and AI'] },
      { label: 'Scope', cells: ['Mainly electricity networks', 'Networks and adjacent assets', 'Grid, solar, wind and oil & gas'] },
      { label: 'Decision support', cells: ['Prioritized field work', 'Engineering and planning', 'Operations, planning and reporting'] },
    ],
    note: 'A high-level comparison of typical approaches, based on publicly available company information; capabilities vary by provider and deployment.',
  },

  covers: {
    title: 'Across your energy assets and environment.',
    text: 'One model across grid, solar, wind and oil & gas, covering six physical factors and horizons from daily operations to 2100.',
    sectors: [
      { id: 'grid', asset: 'grid', title: 'Grid', text: 'Lines, spans, substations, feeders and connected customers.' },
      { id: 'solar', asset: 'solar', title: 'Solar', text: 'Plants and portfolios, from operating conditions to future yield.' },
      { id: 'wind', asset: 'wind', title: 'Wind', text: 'Turbines and farms, from operating windows to repowering.' },
      { id: 'oil-gas', asset: 'oilgas', title: 'Oil & Gas', text: 'Tank farms, pipelines, process units and terminals.' },
    ],
    rows: [
      { label: 'Hazards', text: 'Wildfire, flooding, wind, heat, drought and vegetation, including their combined effects.' },
      { label: 'Horizons', text: 'From near-term operations to maintenance, investment and climate scenarios to 2100.' },
    ],
  },

  proof: {
    title: 'Trusted by energy operators.',
    client: 'UFD (Naturgy)',
    badge: 'E.DSO success case',
    text: 'UFD (Naturgy) gets asset-level risk up to 14 days ahead, validated against ten years of its own incidents, and i-DE (Iberdrola) ranks its overhead lines span by span before each storm.',
    links: [
      { label: 'Read the UFD case', href: `${routes.cases}#ufd` },
      { label: 'Read the i-DE case', href: `${routes.cases}#ide` },
    ],
    imageLabel: 'Photo placeholder: UFD field crew working on an overhead line',
  },

  start: {
    title: 'Start with one use case and grow from there.',
    text: 'Build the Cognitive Twin around a priority your team already has, then extend the same model to more assets, teams and decisions without starting again.',
    steps: [
      { title: 'Choose a priority', text: 'Begin with a concrete operational question.' },
      { title: 'Connect the model', text: 'Bring together the relevant assets, data and physical factors.' },
      { title: 'Expand with confidence', text: 'Reuse the same foundation for new teams and use cases.' },
    ],
  },

  cta: {
    title: 'Put your most important question to the Cognitive Twin.',
    primary: actions.demo,
  },
} as const;

