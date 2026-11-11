import { routes, external } from '../../data/routes';

// Draft About page (/about-new), from "predicterra-about-textos.md" (latest
// brief). Copy word for word. No eyebrows: sections open on their titles.
export default {
  seo: {
    title: 'About Predicterra | European Deep-Tech for the Energy System',
    description:
      'Predicterra builds the Cognitive Twin of the energy system. European by design, independent of any vendor, and trusted by operators with critical infrastructure. Built in Bilbao.',
  },

  compare: {
    label: 'About page',
    current: 'Current',
    draft: 'New draft',
  },

  hero: {
    title: 'European deep-tech for the energy system.',
    text: 'We build the Cognitive Twin that shows energy operators the physical world around their assets, and turns it into decisions.',
    place: 'Built in Bilbao.',
    proof: 'Running on two of Spain’s largest grids.',
    photo: {
      src: '/about/bilbao-1.webp',
      w: 1200,
      h: 800,
      alt: 'BAT Acceleration Tower on Gran Vía, Bilbao, home of the Predicterra office',
    },
  },

  mission: {
    title: 'A Cognitive Twin that makes resilience and the energy transition far simpler.',
    accent: 'far simpler.',
    text: 'One live model of your assets and the world around them. Built for today’s grid, ready for what’s coming.',
  },

  milestones: {
    title: 'From a grid challenge to the Cognitive Twin.',
    items: [
      { year: '2021', text: 'Woza Labs is founded in Bilbao.' },
      { year: '2022', text: 'Wins Iberdrola’s PERSEO grid resilience challenge.' },
      { year: '2023', text: 'First deployment with i-DE. Wins BIND 4.0.' },
      { year: '2025', text: 'On Azure Marketplace. Global coverage at Enlit Europe.' },
      { year: '2026', text: 'Predicterra becomes independent. UFD case published by E.DSO.' },
    ],
  },

  sovereign: {
    title: 'European, independent and under your control.',
    items: [
      { icon: 'lock', title: 'Your data stays in Europe', text: 'EU-hosted, on any major cloud or in your own data center.' },
      {
        icon: 'verified_user',
        title: 'No competitor in control',
        text: 'No utility, vendor or energy company has a say in our product or access to your data.',
      },
      { icon: 'gavel', title: 'Made for EU regulation', text: 'GDPR, CSRD, EU Taxonomy, CER Directive and AI Act.' },
      { icon: 'lock_open', title: 'No lock-in', text: 'Open API and standard formats. Your data leaves whenever you want.' },
    ],
  },

  trust: {
    title: 'Trusted with critical infrastructure.',
    items: [
      { title: 'Secure by design', text: 'Encryption, access control and a full audit log.' },
      { title: 'ISO 27001', text: 'Certification in progress.' },
      { title: 'Explainable', text: 'Every prediction traces back to its data and model version.' },
      { title: 'Human in the loop', text: 'The twin proposes. Your teams decide.' },
      { title: 'Validated against reality', text: 'Backtested on up to ten years of real incidents.' },
    ],
  },

  recognition: {
    title: 'Proven with operators. Recognized by the industry.',
    // Logos from public/logos where a clean file exists; the rest are set as text.
    items: [
      { name: 'Iberdrola PERSEO', text: 'Winner, grid resilience challenge', logo: { src: '/logos/iberdrola.svg', w: 109, h: 27, h1: 26 } },
      { name: 'BIND 4.0', text: 'Winner, with the Basque Energy Agency', logo: { src: '/logos/bind.svg', w: 1305, h: 256, h1: 22 } },
      { name: 'Moeve Light Up', text: 'One of nine deep-science startups', logo: { src: '/logos/moeve.svg', w: 109, h: 20, h1: 20 } },
      { name: 'E.DSO', text: 'UFD deployment published as a success case' },
      { name: 'FutuRed', text: 'Technical paper co-published with i-DE' },
      { name: 'Microsoft', text: 'Available on Azure Marketplace', logo: { src: '/logos/microsoft-partner.svg', w: 1352, h: 350, h1: 30 } },
    ],
  },

  team: {
    title: 'Earth System Engineers.',
    text: 'We don’t hand over a login. We stay until it works.',
    people: [
      { name: 'Sebastián Priolo', role: 'Executive Chairman', photo: '/about/sebastian-priolo.webp' },
      { name: 'Fernando Tadakuma', role: 'Head of Predicterra', photo: '/about/fernando-tadakuma.webp' },
      { name: 'Federico Hasicic', role: 'Head of Science', photo: '/about/federico-hasicic.webp' },
      { name: 'Martín Tanielian', role: 'Head of Earth System Engineering', photo: '/about/martin-tanielian.webp' },
      { name: 'Omer Gómez', role: 'Developer', photo: '/about/omer-gomez.webp' },
    ],
  },

  woza: {
    title: 'Backed by a studio that builds systems for the physical economy.',
    text: 'Predicterra’s ontology, simulation engine and geospatial core were built at Woza Labs, in Bilbao.',
    link: { label: 'Visit Woza Labs', href: external.woza },
  },

  where: {
    title: 'Based in Bilbao. Working across Europe.',
    office: { label: 'Office', value: 'BAT Acceleration Tower, Gran Vía 1, 48001 Bilbao' },
    email: { label: 'Email', value: 'hello@predicterra.com' },
    phone: {
      label: 'Phone',
      items: [
        { label: 'EU', value: '+34 900 752 605', href: 'tel:+34900752605' },
        { label: 'USA', value: '+1 929-323-2391', href: 'tel:+19293232391' },
      ],
    },
    // The BAT tower again, so the office is easy to picture; the link opens it on a map.
    photo: {
      src: '/about/bilbao-1.webp',
      w: 1200,
      h: 800,
      alt: 'BAT Acceleration Tower on Gran Vía, Bilbao, home of the Predicterra office',
    },
    open: { label: 'Open in Google Maps', href: 'https://www.google.com/maps/search/?api=1&query=43.261%2C-2.92821' },
  },

  // The brief's "Get started" eyebrow is left out (no eyebrows on this page).
  cta: {
    titleLine1: 'See your system',
    titleLine2: 'in the',
    titleAccent: 'Cognitive Twin.',
    text: 'Start with one problem, on your own data. Grow on the same model.',
    primary: { label: 'Request a demo', href: routes.demo },
    secondary: { label: 'Talk to an engineer', href: routes.contact, external: false },
  },
};
