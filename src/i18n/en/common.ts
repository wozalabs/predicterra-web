import { routes, external } from '../../data/routes';

export default {
  brand: 'Predicterra',
  skipToContent: 'Skip to content',

  header: {
    homeLabel: 'Predicterra home',
    menu: 'Menu',
    closeMenu: 'Close menu',
    demo: 'Get started',
    navLabel: 'Main',
    toLight: 'Switch to light theme',
    toDark: 'Switch to dark theme',
    // Home · Platform · Solutions ▾ · Cases · About, then the orange button.
    // "Solutions" only opens its panel: it has no page of its own.
    nav: [
      { label: 'Home', href: routes.home },
      { label: 'Platform', href: routes.platform },
      {
        label: 'Solutions',
        groups: [
          {
            title: 'Sectors',
            links: [
              { label: 'Grid', href: routes.sectors.grid },
              { label: 'Solar', href: routes.sectors.solar },
              { label: 'Wind', href: routes.sectors.wind },
              { label: 'Oil & Gas', href: routes.sectors.oilGas },
            ],
          },
          {
            title: 'Across all sectors',
            links: [
              { label: 'Resilience', href: routes.sectors.resilience },
              { label: 'Digitalization', href: routes.sectors.digitalization },
              { label: 'Compliance', href: routes.sectors.compliance },
            ],
          },
        ],
      },
      { label: 'Cases', href: routes.cases },
      { label: 'About', href: routes.about },
    ],
  },

  menu: {
    title: 'Site menu',
    groups: [
      {
        title: 'Platform',
        links: [{ label: 'Platform', href: routes.platform }],
      },
      {
        title: 'Sectors',
        links: [
          { label: 'Grid', href: routes.sectors.grid },
          { label: 'Solar', href: routes.sectors.solar },
          { label: 'Wind', href: routes.sectors.wind },
          { label: 'Oil & Gas', href: routes.sectors.oilGas },
        ],
      },
      {
        title: 'Across all sectors',
        links: [
          { label: 'Resilience', href: routes.sectors.resilience },
          { label: 'Digitalization', href: routes.sectors.digitalization },
          { label: 'Compliance', href: routes.sectors.compliance },
        ],
      },
      {
        title: 'Company',
        links: [
          { label: 'Cases', href: routes.cases },
          { label: 'About', href: routes.about },
          { label: 'Contact', href: routes.contact },
        ],
      },
    ],
    contactLabel: 'Talk to us',
    theme: {
      label: 'Theme',
      dark: 'Dark',
      light: 'Light',
    },
    // Temporary test switch between the two 3D section variants.
    scene: {
      label: '3D view (test)',
      trail: 'Trace',
      overview: 'Overview',
    },
    // Temporary test switch between the two hero layouts.
    hero: {
      label: 'Hero layout (test)',
      centred: 'Centred',
      split: 'Split',
      cutout: 'Cutout',
      pixel: 'Pixel',
      clean: 'Clean',
      app: 'App',
      panel: 'Panel',
      immersive: 'Immersive',
      window: 'Window',
      annotated: 'Annotated',
    },
    email: 'hello@predicterra.com',
  },

  // Footer from the site map (November 2026). "Methodology (PDF)" stays hidden
  // until the PDF exists; "Cookie settings" waits for the cookie banner.
  footer: {
    tagline: 'The Cognitive Twin for energy',
    columns: [
      {
        title: 'Platform',
        links: [{ label: 'Platform', href: routes.platform }],
      },
      {
        title: 'Sectors',
        links: [
          { label: 'Grid', href: routes.sectors.grid },
          { label: 'Solar', href: routes.sectors.solar },
          { label: 'Wind', href: routes.sectors.wind },
          { label: 'Oil & Gas', href: routes.sectors.oilGas },
        ],
      },
      {
        title: 'Across all sectors',
        links: [
          { label: 'Resilience', href: routes.sectors.resilience },
          { label: 'Digitalization', href: routes.sectors.digitalization },
          { label: 'Compliance', href: routes.sectors.compliance },
        ],
      },
      {
        title: 'Company',
        links: [
          { label: 'Cases', href: routes.cases },
          { label: 'About', href: routes.about },
          { label: 'Contact', href: routes.contact },
        ],
      },
      {
        title: 'Legal',
        links: [
          { label: 'Legal notice', href: routes.legal },
          { label: 'Privacy', href: routes.privacy },
        ],
      },
    ],
    contact: {
      address: 'BAT Acceleration Tower, Gran Vía 1, 48001 Bilbao',
      email: 'hello@predicterra.com',
      phones: [
        { label: 'EU', value: '+34 900 752 605', href: 'tel:+34900752605' },
        { label: 'USA', value: '+1 929-323-2391', href: 'tel:+19293232391' },
      ],
      linkedin: { label: 'LinkedIn', href: external.linkedin },
    },
    // Certification marks (public/badges), under the contact details.
    certificationsLabel: 'Certifications',
    certifications: [
      { name: 'GDPR', src: '/badges/gdpr.svg', w: 74, h: 74 },
      { name: 'CCPA ready', src: '/badges/ccpa-ready.svg', w: 56, h: 74 },
    ],
    copyright: '© 2026 Predicterra SL',
    builtBy: 'Built by',
    builtByName: 'Woza Labs',
  },

  // 404 (from the brief). The page answers with a real 404 and is not indexed.
  notFound: {
    label: '404',
    title: 'Page not found.',
    text: 'The page you’re looking for doesn’t exist or has moved.',
    primary: { label: 'Back to home', href: routes.home },
    secondary: { label: 'Get started', href: routes.demo },
    links: [
      { label: 'Platform', href: routes.platform },
      { label: 'Grid', href: routes.sectors.grid },
      { label: 'Solar', href: routes.sectors.solar },
      { label: 'Wind', href: routes.sectors.wind },
      { label: 'Oil & Gas', href: routes.sectors.oilGas },
    ],
  },
};
