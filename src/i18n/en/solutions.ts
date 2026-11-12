import { routes } from '../../data/routes';
import { actions, howToStart, cta } from './pages-shared';

// /solutions, from "predicterra-solutions.md". Copy word for word; eyebrows left out
// (each team's horizon stays, on the rail and next to its title).
export default {
  seo: {
    title: 'Solutions for Operations, Planning, Risk and Compliance | Predicterra',
    description:
      'One Cognitive Twin, four teams. Storm and wildfire alerts, capex prioritization, cascading risk and CSRD reporting on one model, from the next 14 days to 2100.',
  },

  hero: {
    label: 'Solutions',
    title: 'One model. Every team. Every decision.',
    text: 'Operations, planning, risk and compliance work from the same Cognitive Twin, each at its own horizon. Start with one problem. The next one runs on the same model.',
    primary: actions.demo,
    secondary: actions.platform,
    visual: 'The homepage territory, changing with the stretch of the timeline that is highlighted.',
  },

  four: {
    title: 'The same reality, read at different distances.',
    teams: [
      { name: 'Operations', horizon: 'Today to 14 days', question: 'Which assets will fail, and what do we do first?' },
      { name: 'Planning', horizon: '1 to 10 years', question: 'Where should maintenance and capex go?' },
      { name: 'Risk', horizon: 'Every horizon', question: 'How exposed are we, and what fails with each asset?' },
      { name: 'Compliance', horizon: 'To 2100', question: 'Can we prove it, to the regulator and to investors?' },
    ],
    closing:
      'Because all four work on the same objects, their answers agree. What operations sees every winter shows up in the plan, in the risk register and in the report.',
  },

  teams: [
    {
      id: 'operations',
      name: 'Operations',
      horizon: 'Today to 14 days',
      title: 'See the event before it reaches your assets.',
      text: 'Every asset ranked by risk for the days ahead, with severity, confidence, time window and a recommended action. Crews, spares and safety measures in place before the event, not after the first call.',
      solutions: [
        { title: 'Event impact forecast', text: 'Which assets fail in the next 14 days, and why.' },
        { title: 'Crew and spares pre-positioning', text: 'Resources where the event will hit.' },
        { title: 'Wildfire alerts', text: 'Ignition and spread risk around every asset.' },
        { title: 'Flood alerts', text: 'Where the water reaches, and what goes under.' },
        { title: 'Heat and wind alerts', text: 'Thermal stress, gusts and safe-access windows.' },
      ],
      connects: 'SCADA, OMS and field service tools',
      measured: 'Response time, interruptions avoided (TIEPI, NIEPI), availability, unplanned downtime, outage costs',
      shot: 'Platform capture: assets ranked by risk, the explanation panel of one asset and the event’s time window.',
    },
    {
      id: 'planning',
      name: 'Planning',
      horizon: '1 to 10 years',
      title: 'Put every euro where the risk really is.',
      text: 'Maintenance, vegetation management, hardening and new assets prioritized by real exposure, not by calendar. Every option compared by the risk it removes per euro invested.',
      solutions: [
        { title: 'Vegetation management', text: 'Clearing and trimming by risk, not by cycle.' },
        { title: 'Maintenance priorities', text: 'Inspections ranked by real exposure.' },
        { title: 'Hardening capex', text: 'Reinforcement, protection and undergrounding where they cut the most risk.' },
        { title: 'Siting', text: 'New assets where the future climate allows.' },
        { title: 'Adaptation paths', text: 'Investment tested against 2050 and 2100.' },
      ],
      connects: 'EAM, capex planning and GIS',
      measured: 'Capex efficiency, risk reduced per euro, deferred replacements',
      shot: 'Platform capture: investment priority map with critical zones and a table of options compared.',
    },
    {
      id: 'risk',
      name: 'Risk',
      horizon: 'Every horizon',
      title: 'Know what fails, and everything that fails with it.',
      text: 'Exposure for every asset to six hazards on one model, compound risk included, and the chain of dependencies downstream: which feeders, customers, plants and contracts hang on each asset.',
      solutions: [
        { title: 'Asset exposure', text: 'Six hazards per asset, combined.' },
        { title: 'Cascading dependencies', text: 'What fails with each asset.' },
        { title: 'Production at risk', text: 'Output lost to heat, wind and drought.' },
        { title: 'Expected loss', text: 'The cost of doing nothing, by scenario.' },
        { title: 'Insurance and risk transfer', text: 'Exposure data insurers can underwrite.' },
      ],
      connects: 'Risk registers, ERP, finance and insurance models',
      measured: 'Expected loss, critical dependencies identified, insurance terms',
      shot: 'Platform capture: cascading dependency map, an exposed asset and everything that depends on it.',
    },
    {
      id: 'compliance',
      name: 'Compliance',
      horizon: 'To 2100',
      title: 'Prove it, from the model you operate.',
      text: 'CSRD, EU Taxonomy and CER Directive reports come out of the same model your control center uses, with the evidence behind every number.',
      solutions: [
        { title: 'CSRD (ESRS E1)', text: 'Physical climate risk, asset by asset.' },
        { title: 'EU Taxonomy', text: 'Climate risk and vulnerability assessments per eligible asset.' },
        { title: 'CER Directive', text: 'Natural-hazard risk assessments, documented.' },
        { title: 'Resilience plans', text: 'Investment cases regulators can follow.' },
        { title: 'Audit trail', text: 'Every figure traced to its data and model.' },
      ],
      connects: 'Sustainability and reporting tools',
      measured: '95% less time producing climate and compliance reports',
      shot: 'Platform capture: a generated report with an exposure map, a scenario chart and the source of every figure.',
      // "See Compliance →" waits for the Compliance page (not built yet).
    },
  ],

  event: {
    title: 'One heatwave. Four teams. Zero handoffs.',
    steps: [
      {
        when: 'Day −7',
        team: 'Operations',
        text: 'The twin flags lines, substations and solar plants at risk from heat and wildfire. Crews and patrols are scheduled.',
      },
      { when: 'Day 0', team: 'Operations', text: 'The heatwave arrives. Response starts from the ranking, not from the first alarm.' },
      {
        when: 'Day +30',
        team: 'Planning',
        text: 'The same assets top the ranking every summer. They move into the hardening and adaptation plan.',
      },
      {
        when: 'Year end',
        team: 'Risk and compliance',
        text: 'The event, the response and the plan are already evidence for the risk register, the regulator and the CSRD report.',
      },
    ],
  },

  matrix: {
    title: 'Every sector. Every team. One model.',
    teams: ['Operations', 'Planning', 'Risk', 'Compliance'],
    rows: [
      {
        sector: 'Grid',
        icon: 'electrical_services',
        href: routes.sectors.grid,
        cells: [
          'Span-level risk 14 days ahead',
          'Vegetation and hardening by exposure',
          'Feeders and customers downstream',
          'Quality of supply and CER',
        ],
      },
      {
        sector: 'Solar',
        icon: 'solar_power',
        href: routes.sectors.solar,
        cells: ['Heat and fire alerts per plant', 'Siting and yield to 2100', 'Production at risk', 'EU Taxonomy for financing'],
      },
      {
        sector: 'Wind',
        icon: 'wind_power',
        href: routes.sectors.wind,
        cells: ['Shutdown and lifting windows', 'Siting and repowering', 'Production and damage at risk', 'CSRD and lender due diligence'],
      },
      {
        sector: 'Oil & Gas',
        icon: 'oil_barrel',
        href: routes.sectors.oilGas,
        cells: [
          'Fire and flood alerts per site',
          'Turnarounds around real risk',
          'Power and water dependencies',
          'CSRD, CER and safety inputs',
        ],
      },
    ],
  },

  start: howToStart('your systems'),

  cta: cta('See your teams', 'in the', 'Cognitive Twin.'),
} as const;
