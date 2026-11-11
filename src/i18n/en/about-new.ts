import { routes, external } from '../../data/routes';

// Draft About page (/about-new), from the "predicterra-about.md" brief.
// Copy is the brief's final text, word for word. The brief's [VISUAL] notes are
// interpreted in the site's current design language, not followed literally;
// its [NOTA] items are open decisions and are not shown on the page.
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
    eyebrow: 'About Predicterra',
    title: 'European deep-tech for the energy system.',
    text: 'Energy infrastructure operates inside a physical world it cannot fully see. Predicterra builds the Cognitive Twin that makes it visible, and turns it into decisions. Built in Bilbao, running on two of Spain’s largest grids.',
    photo: {
      src: '/about/bilbao-1.webp',
      w: 1200,
      h: 800,
      alt: 'BAT Acceleration Tower on Gran Vía, Bilbao, home of the Predicterra office',
    },
  },

  mission: {
    label: 'Our mission',
    title: 'The physical world, modeled for the infrastructure that matters most.',
    text: 'The energy transition will be decided in the physical world: in the storms, the fires, the floods and the heat that every asset has to withstand. We build the model that lets the people who run that infrastructure see it coming, and act together.',
    definition: {
      term: 'Cognitive Twin',
      text: 'A Cognitive Twin is a live model of your assets, the physical world acting on them and how everything connects. It tells every team what will happen, why, and what to do.',
    },
  },

  story: {
    label: 'Our story',
    title: 'Technology first. Company second.',
    quote: { text: 'Newly incorporated.', accent: 'Not new.' },
    paragraphs: [
      'Predicterra started inside Woza Labs as a deployment of our core technology. From the first day it ran on real infrastructure, solving real operational problems for Spain’s largest grid operators. Its first milestones weren’t fundraising rounds or beta users. They were deployments, published results and recognition from the industry it was built to serve.',
      'Once the technology had proven its value, Predicterra became an independent company. The company didn’t validate the technology. The technology earned the company.',
    ],
  },

  milestones: {
    label: 'Milestones',
    title: 'From a grid challenge to the Cognitive Twin.',
    items: [
      { year: '2021', text: 'Woza Labs is founded in Bilbao.' },
      { year: '2022', text: 'Wins Iberdrola’s PERSEO challenge on grid resilience to natural disasters.' },
      {
        year: '2023',
        text: 'First deployment with i-DE in Bizkaia; paper co-published with i-DE at the FutuRed Smart Grids Congress. Wins BIND 4.0 with the Basque Energy Agency.',
      },
      { year: '2025', text: 'Available on Microsoft Azure Marketplace. Global coverage presented at Enlit Europe, Bilbao.' },
      {
        year: '2026',
        text: 'Predicterra SL becomes an independent company. UFD case published by E.DSO. Selected for the FutuRed Grid Congress and present at Enlit Europe, Vienna.',
      },
    ],
  },

  europe: {
    label: 'European by design',
    title: 'Built in Europe, for Europe’s energy system.',
    text: 'Energy data is critical infrastructure. Where it lives, who controls it and which rules it follows matter as much as what the model can do. Predicterra was designed in Europe, under European rules, from the first line of code.',
    items: [
      {
        icon: 'location_on',
        title: 'Built in Europe',
        text: 'Designed and developed in Bilbao, in the Basque Country, one of Europe’s energy industry hubs.',
      },
      {
        icon: 'lock',
        title: 'Your data stays in Europe',
        text: 'Hosted in the EU, on any major cloud, or in your own data center. Critical data never leaves your perimeter.',
      },
      {
        icon: 'gavel',
        title: 'Designed for European regulation',
        text: 'Built around GDPR, CSRD, the EU Taxonomy, the CER Directive and the AI Act.',
      },
      {
        icon: 'hub',
        title: 'Part of Europe’s energy ecosystem',
        text: 'Member of Iberdrola’s Global Smart Grids Innovation Hub and FutuRed, the Spanish smart grid platform.',
      },
    ],
  },

  independent: {
    label: 'Independent',
    title: 'Built for energy operators. Controlled by none of their competitors.',
    text: 'No utility, oil company, equipment maker or software vendor controls Predicterra. None of the companies you compete with, or buy from, decides what we build or sees your data. That leaves us free to do one thing: give you the best possible model of your assets and the world around them.',
    items: [
      { title: 'No competitor in control', text: 'No energy company you compete with has a say in our product, or access to your data.' },
      {
        title: 'No vendor agenda',
        text: 'We don’t sell equipment or another platform. The twin recommends the action that removes the most risk, not the one that sells more hardware.',
      },
      { title: 'Works with what you run', text: 'Any GIS, SCADA, EAM, ERP or cloud, whoever built it.' },
      {
        title: 'No lock-in',
        text: 'Your data leaves through an open API whenever you want. Open interfaces, standard formats and reproducible methods: you stay because it works, not because you can’t leave.',
      },
    ],
  },

  trust: {
    label: 'Trust',
    title: 'Trusted with critical infrastructure.',
    text: 'We work on the assets that keep the lights on. That shapes how we build.',
    items: [
      { title: 'Secure by design', text: 'Encryption, access control and a full log of who did what, on every object and every result.' },
      {
        title: 'Security management',
        text: 'ISO 27001 certification in progress for how we manage information security, from infrastructure to people.',
      },
      {
        title: 'Explainable',
        text: 'Every prediction is tied to the assets, data and model version behind it. No black boxes in the control room.',
      },
      {
        title: 'Human in the loop',
        text: 'The twin proposes; your teams decide. Every recommendation can be reviewed before it becomes an action.',
      },
      {
        title: 'Validated against reality',
        text: 'Models are backtested against operators’ real incidents, up to ten years on distribution networks.',
      },
    ],
    seals: ['GDPR', 'EU-hosted', 'ISO 27001 certification in progress', 'Microsoft Azure Marketplace'],
  },

  recognition: {
    label: 'Recognition',
    title: 'Proven with operators. Recognized by the industry.',
    // Logos from public/logos where a clean file exists; the rest are set as text.
    items: [
      { name: 'Iberdrola PERSEO', text: 'Winner of the challenge on grid resilience to natural disasters', logo: { src: '/logos/iberdrola.svg', w: 109, h: 27, h1: 26 } },
      { name: 'BIND 4.0', text: 'Winner, with the Basque Energy Agency', logo: { src: '/logos/bind.svg', w: 1305, h: 256, h1: 22 } },
      { name: 'Moeve Light Up', text: 'Selected, one of nine deep-science startups', logo: { src: '/logos/moeve.svg', w: 109, h: 20, h1: 20 } },
      { name: 'E.DSO', text: 'UFD deployment published as a success case' },
      { name: 'FutuRed', text: 'Technical paper co-published with i-DE' },
      { name: 'Microsoft', text: 'Available on Azure Marketplace', logo: { src: '/logos/microsoft-partner.svg', w: 1352, h: 350, h1: 30 } },
    ],
  },

  team: {
    label: 'The team',
    title: 'Earth System Engineers.',
    text: 'Engineers, scientists and energy specialists working as one. We don’t hand over a login. We connect the platform to the reality of your assets, and stay until it works.',
    people: [
      { name: 'Sebastián Priolo', role: 'Executive Chairman', org: 'CEO, Woza Labs', photo: '/about/sebastian-priolo.webp' },
      { name: 'Fernando Tadakuma', role: 'Head of Predicterra', org: 'CDO, Woza Labs', photo: '/about/fernando-tadakuma.webp' },
      { name: 'Federico Hasicic', role: 'Head of Science', org: 'CRSO, Woza Labs', photo: '/about/federico-hasicic.webp' },
      {
        name: 'Martín Tanielian',
        role: 'Head of Earth System Engineering',
        org: 'IT Lead, Woza Labs',
        photo: '/about/martin-tanielian.webp',
      },
      { name: 'Omer Gómez', role: 'Developer', org: '', photo: '/about/omer-gomez.webp' },
    ],
  },

  woza: {
    label: 'Built by Woza',
    title: 'Backed by a studio that builds systems for the physical economy.',
    text: 'Predicterra was born at Woza Labs, a Bilbao deep-tech studio. Its ontology, its simulation engine and its geospatial core were built there from the ground up, and keep evolving with every product the studio builds.',
    link: { label: 'Visit Woza Labs', href: external.woza },
  },

  where: {
    label: 'Where we are',
    title: 'Based in Bilbao. Working across Europe.',
    address: 'BAT Acceleration Tower, Gran Vía 1, 48001 Bilbao, Bizkaia',
    email: 'hello@predicterra.com',
    phones: [
      { label: 'EU', value: '+34 900 752 605', href: 'tel:+34900752605' },
      { label: 'USA', value: '+1 929-323-2391', href: 'tel:+19293232391' },
    ],
    join: { text: 'Want to model the physical world with us? Write to', email: 'hello@predicterra.com' },
    map: { place: 'BAT Acceleration Tower', city: 'Bilbao' },
  },

  cta: {
    titleLine1: 'See your system',
    titleLine2: 'in the',
    titleAccent: 'Cognitive Twin.',
    text: 'Start with one problem, on your own data. Grow across teams and sectors on the same model.',
    primary: { label: 'Request a demo', href: routes.demo },
    secondary: { label: 'Talk to an engineer', href: routes.contact, external: false },
  },
};
