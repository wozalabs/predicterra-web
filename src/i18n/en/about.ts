import { external } from '../../data/routes';

// /about, from "predicterra-11-about.md". Copy word for word; eyebrows left out.
// Photos stay in colour (site rule), whatever the brief's visual note says.
export default {
  seo: {
    title: 'About Predicterra | European Deep-Tech for the Energy System',
    description:
      'Predicterra builds the Cognitive Twin of the energy system. Built in Bilbao, independent of any vendor, and in operation on two of Spain’s largest grids.',
  },
  hero: {
    label: 'About Predicterra',
    title: 'European deep-tech for the energy system.',
    text: 'Predicterra started inside Woza Labs, running on real infrastructure for Spain’s largest grid operators. Once the technology had proven its value, it became an independent company.',
    quote: 'Newly incorporated. Not new.',
    facts: [
      'Built in Bilbao',
      'Independent of any energy company or vendor',
      'In operation on two of Spain’s largest grids',
    ],
    photo: {
      src: '/about/bilbao-1.webp',
      w: 1200,
      h: 800,
      alt: 'BAT Acceleration Tower on Gran Vía, Bilbao, home of the Predicterra office',
    },
  },
  team: {
    title: 'Earth System Engineers.',
    text: 'Engineers, scientists and energy specialists. We connect the platform to the reality of your assets, and stay until it works.',
    people: [
      { name: 'Sebastián Priolo', role: 'Executive Chairman', photo: '/about/sebastian-priolo.webp' },
      { name: 'Fernando Tadakuma', role: 'Head of Predicterra', photo: '/about/fernando-tadakuma.webp' },
      { name: 'Federico Hasicic', role: 'Head of Science', photo: '/about/federico-hasicic.webp' },
      { name: 'Martín Tanielian', role: 'Head of Earth System Engineering', photo: '/about/martin-tanielian.webp' },
      { name: 'Omer Gómez', role: 'Developer', photo: '/about/omer-gomez.webp' },
    ],
  },
  woza: {
    text: 'Built by Woza Labs, a Bilbao deep-tech studio.',
    link: { label: 'Visit Woza Labs', href: external.woza },
  },
  contact: {
    address: 'BAT Acceleration Tower, Gran Vía 1, 48001 Bilbao',
    email: 'hello@predicterra.com',
    join: 'Want to model the physical world with us?',
    joinCta: 'Write to hello@predicterra.com',
  },
} as const;
