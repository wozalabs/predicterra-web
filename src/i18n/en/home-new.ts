import { routes } from '../../data/routes';
import { actions, cta, logoBand } from './pages-shared';
import home from './home';

// New home content (/home-new), from "predicterra-01-home.md". Copy word for
// word; section eyebrows left out. The 3D section keeps the current scene and
// asset panels; only its texts change to the brief's incidents (values are
// illustrative, as the brief says).

const incidents: Record<string, { asset: string; coming: string; todo: string }> = {
  grid: { asset: 'Span 4471 · Feeder F-12', coming: 'Gusts of 90 km/h in 36 hours', todo: 'Pre-position crew B' },
  solar: { asset: 'PV plant · Block 12', coming: '46 °C on Thursday, output at risk', todo: 'Inspect inverters before noon' },
  wind: { asset: 'Turbine T-07', coming: 'Gusts above cut-out speed tonight', todo: 'Stop at 22:00, restart at 06:00' },
  oilgas: { asset: 'Refinery · Tank farm B', coming: 'River flood in 48 hours', todo: 'Protect tanks, adjust throughput' },
};

const cascade =
  'Line L-12 fails → the solar plant that exports through it stops → the pumping station on the same substation switches to backup power.';

const scene = {
  ...home.scene,
  label: 'One system',
  title: 'Energy is one machine. Run it like one.',
  intro:
    'Grid, solar, wind and oil & gas share the same weather, the same land and the same substations. Predicterra puts them in one model, so a risk shows up wherever it lands.',
  sectors: home.scene.sectors.map((s) => {
    const inc = incidents[s.id];
    if (!inc) {
      // The substation stop tells the cascade instead of an incident of its own.
      return { ...s, title: 'Cascade', text: cascade };
    }
    return {
      ...s,
      text: `${inc.asset}. ${inc.coming}. ${inc.todo}.`,
      alert: { ...s.alert, asset: inc.asset, action: `${inc.todo}.` },
      panel: { ...s.panel, name: inc.asset },
    };
  }),
  capabilities: [
    {
      ...home.scene.capabilities[0],
      text: 'Your systems and thousands of external sources in one living model, ready for every team, system and AI agent.',
      href: routes.sectors.digitalization,
    },
    {
      ...home.scene.capabilities[1],
      text: 'CSRD, EU Taxonomy and CER evidence from the same model your teams use every day.',
      href: routes.sectors.compliance,
    },
  ],
};

export default {
  seo: {
    title: 'Predicterra | The Cognitive Twin for Energy',
    description:
      'The Cognitive Twin for grid, solar, wind and oil & gas. See what’s coming to every energy asset, from the next storm to 2100.',
  },

  hero: {
    label: 'The Cognitive Twin for energy',
    titleLine1: 'See what’s coming to',
    titleLine2: 'every energy asset.',
    text: 'Predicterra models the storms, fires, floods and heat around your infrastructure, and every asset and dependency they touch. Every team knows what will happen, why, and what to do first.',
    primary: actions.demo,
    secondary: actions.platform,
  },

  logos: logoBand,

  scene,
  sectorsLink: {
    label: 'Explore by sector',
    links: [
      { label: 'Grid', href: routes.sectors.grid },
      { label: 'Solar', href: routes.sectors.solar },
      { label: 'Wind', href: routes.sectors.wind },
      { label: 'Oil & Gas', href: routes.sectors.oilGas },
    ],
  },

  teams: {
    title: 'One model. Every team.',
    items: [
      { team: 'Operations', horizon: 'Today to 14 days', gets: 'Which assets will fail, and what to do first.' },
      { team: 'Planning', horizon: '1 to 10 years', gets: 'Maintenance and capex where they cut the most risk.' },
      { team: 'Risk', horizon: 'Every horizon', gets: 'What fails with each asset, and what it costs.' },
      { team: 'Compliance', horizon: 'To 2100', gets: 'CSRD, EU Taxonomy and CER evidence, from the same model.' },
    ],
    links: [
      { label: 'Resilience', href: routes.sectors.resilience },
      { label: 'Compliance', href: routes.sectors.compliance },
      { label: 'Digitalization', href: routes.sectors.digitalization },
    ],
  },

  figures: [
    { value: '14 days', text: 'of asset-level forecasts' },
    { value: '€2.1M', text: 'in outage costs avoided a year' },
    { value: '5×', text: 'faster from data to decision' },
    { value: '95%', text: 'less time producing climate and compliance reports' },
  ],

  cases: {
    title: 'In operation today.',
    text: 'Two of Spain’s largest distribution networks already use Predicterra.',
    items: [
      {
        client: 'i-DE (Iberdrola)',
        logo: { src: '/logos/iberdrola.svg', w: 109, h0: 27, h: 22 },
        value: '73%',
        label: 'faster response to climate events',
        text: 'Span-level risk across 85,000 km of overhead lines. Crews in place before the storm hits.',
        badge: 'PERSEO challenge winner',
      },
      {
        client: 'UFD (Naturgy)',
        logo: { src: '/logos/ufd.svg', w: 848, h0: 512, h: 32 },
        value: '116,000 km',
        label: 'of grid in one model',
        text: 'Asset-level risk up to 14 days ahead, validated against ten years of real incidents.',
        badge: 'E.DSO success case',
      },
    ],
    link: { label: 'See the cases', href: routes.cases },
  },

  trust: [
    { icon: 'location_on', text: 'Built in Europe' },
    { icon: 'lock', text: 'EU-hosted, in your cloud or on-premises' },
    { icon: 'lock_open', text: 'Independent of any energy company or vendor' },
    { icon: 'verified_user', text: 'ISO 27001 certification in progress' },
  ],

  cta: cta('See your system', 'in the', 'Cognitive Twin.'),
} as const;
