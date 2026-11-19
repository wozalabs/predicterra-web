import { external } from '../../data/routes';

// /about, from "predicterra-03-about.md". Final copy; section eyebrows left out.
// Photos stay in colour (site rule), whatever the brief's visual note says.
export default {
  seo: {
    title: 'About Predicterra | European Deep-Tech for the Energy System',
    description:
      'Predicterra builds the Cognitive Twin of the energy system in Bilbao, European by design and independent of any vendor.',
  },
  hero: {
    title: 'European deep-tech for the energy system.',
    accent: 'energy system.',
    text: 'Predicterra builds the Cognitive Twin of the energy system: a live model of energy assets, the physical world acting on them and how everything connects.',
    note: 'Built in Bilbao, trusted by Iberdrola, Naturgy and Moeve.',
    photo: {
      src: '/about/bilbao-1.webp',
      w: 1200,
      h: 800,
      alt: 'BAT Acceleration Tower on Gran Vía, Bilbao, home of the Predicterra office',
    },
  },
  story: {
    title: 'Built on real infrastructure from the first day.',
    text: 'Predicterra started inside Woza Labs as a deployment of our core technology. From the first day it ran on real infrastructure, solving real operational problems for Spain’s largest grid operators, and its first milestones were deployments, published results and recognition from the industry it was built to serve. Once the technology had proven its value, Predicterra became an independent company, controlled by no utility, oil company, equipment maker or software vendor.',
  },
  team: {
    title: 'Earth System Engineers.',
    text: 'Engineers, scientists and energy specialists who connect the platform to the reality of your assets and stay until it works.',
    people: [
      { name: 'Sebastián Priolo', role: 'Executive Chairman', photo: '/about/sebastian-priolo.webp' },
      { name: 'Fernando Tadakuma', role: 'Head of Predicterra', photo: '/about/fernando-tadakuma.webp' },
      { name: 'Federico Hasicic', role: 'Head of Science', photo: '/about/federico-hasicic.webp' },
      { name: 'Martín Tanielian', role: 'Head of Earth System Engineering', photo: '/about/martin-tanielian.webp' },
      { name: 'Omer Gómez', role: 'Developer', photo: '/about/omer-gomez.webp' },
    ],
  },
  woza: {
    text: 'Predicterra was born at Woza Labs, a Bilbao deep-tech studio, where its ontology, its simulation engine and its geospatial core were built from the ground up.',
    link: { label: 'Visit Woza Labs', href: external.woza },
  },
  contact: {
    officeLabel: 'Office',
    address: 'BAT Acceleration Tower, Gran Vía 1, 48001 Bilbao',
    emailLabel: 'Email',
    email: 'hello@predicterra.com',
    joinLabel: 'Join us',
    join: 'To model the physical world with us, write to',
  },
} as const;
