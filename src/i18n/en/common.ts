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
    nav: [
      { label: 'Platform', href: routes.platform },
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
          { label: 'How it works', href: routes.platform },
          { label: 'Solutions', href: routes.solutions },
          { label: 'Success stories', href: routes.cases },
        ],
      },
      {
        title: 'Sectors',
        links: [
          { label: 'Grid', href: routes.sectors.grid },
          { label: 'Solar', href: routes.sectors.solar },
          { label: 'Wind', href: routes.sectors.wind },
          { label: 'Oil & gas', href: routes.sectors.oilGas },
          { label: 'Climate & resilience', href: routes.sectors.climate },
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

  footer: {
    tagline: 'The physical world, modeled for the infrastructure that matters most.',
    columns: [
      {
        title: 'Platform',
        links: [
          { label: 'How it works', href: routes.platform },
          { label: 'Solutions', href: routes.solutions },
          { label: 'Success stories', href: routes.cases },
          { label: 'Explore on Azure', href: external.azure, external: true },
        ],
      },
      {
        title: 'Sectors',
        links: [
          { label: 'Grid', href: routes.sectors.grid },
          { label: 'Solar', href: routes.sectors.solar },
          { label: 'Wind', href: routes.sectors.wind },
          { label: 'Oil & gas', href: routes.sectors.oilGas },
          { label: 'Climate & resilience', href: routes.sectors.climate },
          { label: 'Digitalization', href: routes.sectors.digitalization },
        ],
      },
      {
        title: 'Company',
        links: [
          { label: 'About', href: routes.about },
          { label: 'Contact', href: routes.contact },
          { label: 'LinkedIn', href: external.linkedin, external: true },
        ],
      },
    ],
    contact: {
      title: 'Contact',
      email: 'hello@predicterra.com',
      phones: [
        { label: 'EU', value: '+34 900 752 605', href: 'tel:+34900752605' },
        { label: 'USA', value: '+1 929 323 2391', href: 'tel:+19293232391' },
      ],
      address: ['BAT Tower, Gran Vía 1', '48001 Bilbao, Bizkaia, Spain'],
    },
    compliance: ['GDPR', 'CCPA'],
    copyright: '© 2026 Predicterra SL. All rights reserved.',
    builtBy: 'Built by',
    builtByName: 'Woza Labs',
    legal: [
      { label: 'Privacy', href: routes.privacy },
      { label: 'Legal', href: routes.legal },
    ],
  },
};
