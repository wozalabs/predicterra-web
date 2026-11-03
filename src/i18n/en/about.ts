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

  story: {
    label: 'Our story',
    title: 'Technology first. Company second.',
    paragraphs: [
      'Predicterra started inside Woza Labs as a deployment of our core technology. From the beginning, it operated on real infrastructure, solving real operational problems.',
      'Its first milestones weren’t fundraising rounds or beta users. They were deployments, industry adoption, and recognition from the organizations it was built to serve.',
      'Once the technology had proven its value, Predicterra became an independent company. The company didn’t validate the technology.',
    ],
    accent: 'The technology earned the company.',
  },

  recognition: {
    label: 'Backed by the industry',
    title: 'Recognized by the sector it serves',
    items: [
      {
        program: 'Iberdrola Perseo',
        title: 'Selected innovation program',
        text: 'Selected into Iberdrola’s innovation program.',
        logo: { name: 'Iberdrola', src: '/logos/iberdrola.svg', w: 109, h0: 27, h: 26 },
      },
      {
        program: 'BIND 4.0',
        title: 'Winner',
        text: 'Winner, Basque Industry 4.0 accelerator.',
        logo: { name: 'BIND 4.0', src: '/logos/bind.svg', w: 1305, h0: 256, h: 22 },
      },
      {
        program: 'Moeve Light Up',
        title: 'Selected program company',
        text: 'Selected for Moeve’s Light Up program.',
        logo: { name: 'Moeve', src: '/logos/moeve.svg', w: 109, h0: 20, h: 19 },
      },
    ],
  },

  team: {
    label: 'The team',
    title: 'Earth System Engineers',
    text: 'Engineers, scientists and energy specialists working as one. The people who connect the platform to the reality of your network, and make it act.',
    // Photos in public/about (see scripts/fetch-about-images.mjs).
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
    photos: [
      { src: '/about/bilbao-1.webp', w: 1200, h: 800 },
      { src: '/about/bilbao-2.webp', w: 1600, h: 896 },
    ],
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
