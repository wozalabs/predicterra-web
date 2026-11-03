import { routes } from '../../data/routes';

// Copy from predicterra.com/about. Team numbers are sequential (the live site
// shows "10" twice); labels are sentence case (brand: no uppercase).
export default {
  seo: {
    title: 'About Predicterra | Foresight Infrastructure for Energy',
    description:
      'Predicterra builds foresight infrastructure for energy and critical assets. Built by Woza Labs, modeling the physical world for what matters most.',
  },

  hero: {
    eyebrow: 'About',
    title: 'Deep-tech for energy resilience.',
    text: 'Energy infrastructure operates inside a physical world it cannot see. Predicterra builds the system that makes it visible, and turns it into decisions.',
  },

  team: {
    label: 'The team',
    title: 'Earth System Engineers',
    text: 'Engineers, scientists and energy specialists working as one. The people who connect the platform to the reality of your network, and make it act.',
    // Photos in public/about, from predicterra.com/about.
    people: [
      { name: 'Sebastian Priolo', role: 'Executive Chairman', org: 'CEO @wozalabs', photo: '/about/sebastian-priolo.webp' },
      { name: 'Fernando Tadakuma', role: 'Head of Predicterra', org: 'CDO @wozalabs', photo: '/about/fernando-tadakuma.webp' },
      { name: 'Federico Hasicic', role: 'Head of Science', org: 'CRSO @wozalabs', photo: '/about/federico-hasicic.webp' },
      { name: 'Martin Tanielian', role: 'Head of Earth System Engineer', org: 'IT Lead @wozalabs', photo: '/about/martin-tanielian.webp' },
      { name: 'Omer Gómez', role: 'Developer', org: '', photo: '/about/omer-gomez.webp' },
    ],
  },

  where: {
    label: 'Where we are',
    title: 'Based in Bilbao',
    text: 'Predicterra was built in the Basque Country, at the centre of Europe’s energy industry, and runs on the assets of the operators who work with us.',
    address: 'BAT - Gran Vía 1, 48001, Bizkaia.',
    phones: [
      { label: 'EU', value: '+34 900 752 605', href: 'tel:+34900752605' },
      { label: 'USA', value: '+1 929-323-2391', href: 'tel:+19293232391' },
    ],
    photo: { src: '/about/bilbao-1.webp', w: 1200, h: 800, alt: 'BAT tower on Gran Vía, Bilbao, home of the Predicterra office' },
  },

  cta: {
    label: 'Ready before the next event',
    titleLine1: 'Run your infrastructure',
    titleLine2: 'on',
    titleAccent: 'foresight.',
    text: 'One live system across every asset, every feed, every team. Act before the event, not after the report.',
    primary: { label: 'Deploy Predicterra', href: routes.demo },
  },
};
