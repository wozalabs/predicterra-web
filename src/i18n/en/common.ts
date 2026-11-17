import { routes, external } from '../../data/routes';

export default {
  brand: 'Predicterra',
  skipToContent: 'Skip to content',

  header: {
    homeLabel: 'Predicterra home',
    menu: 'Menu',
    closeMenu: 'Close menu',
    demo: 'Request a demo',
    navLabel: 'Main',
    font: 'Font',
    fontLabel: 'Typeface (test)',
    toLight: 'Switch to light theme',
    toDark: 'Switch to dark theme',
    nav: [
      { label: 'Platform', href: routes.platform },
      { label: 'Cases', href: routes.cases },
      { label: 'About', href: routes.about },
      { label: 'Contact', href: routes.contact },
    ],
  },

  menu: {
    title: 'Site menu',
    groups: [
      {
        title: 'Platform',
        links: [
          { label: 'Platform', href: routes.platform },
          { label: 'Cases', href: routes.cases },
        ],
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
        title: 'Solutions',
        links: [
          { label: 'Resilience', href: routes.sectors.resilience },
          { label: 'Compliance', href: routes.sectors.compliance },
          { label: 'Digitalization', href: routes.sectors.digitalization },
        ],
      },
      {
        title: 'Company',
        links: [
          { label: 'About', href: routes.about },
          { label: 'Contact', href: routes.contact },
          { label: 'Explore on Azure', href: external.azure, external: true },
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
    },
    email: 'hello@predicterra.com',
  },

  // Footer from the home brief (November 2026). "Methodology (PDF)" stays hidden
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
        title: 'Solutions',
        links: [
          { label: 'Resilience', href: routes.sectors.resilience },
          { label: 'Compliance', href: routes.sectors.compliance },
          { label: 'Digitalization', href: routes.sectors.digitalization },
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
          { label: 'Cookies', href: routes.cookies },
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
    copyright: '© 2026 Predicterra SL',
    builtBy: 'Built by',
    builtByName: 'Woza Labs',
  },

  // 404 (from the brief).
  notFound: {
    title: 'This page isn’t in the model.',
    text: 'The page you’re looking for doesn’t exist or has moved. Everything else is still running.',
    primary: { label: 'Back to home', href: routes.home },
    secondary: { label: 'Request a demo', href: routes.demo },
    links: [
      { label: 'Platform', href: routes.platform },
      { label: 'Grid', href: routes.sectors.grid },
      { label: 'Solar', href: routes.sectors.solar },
      { label: 'Wind', href: routes.sectors.wind },
      { label: 'Oil & Gas', href: routes.sectors.oilGas },
    ],
  },

  // Comparison switch between the current home and the new content.
  compare: {
    label: 'Home',
    current: 'Current',
    next: 'New content',
  },
};
