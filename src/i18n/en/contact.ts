import { routes } from '../../data/routes';

// /contact, from "predicterra-11-contact.md". Every "Request a demo" and "Talk
// to an engineer" on the site leads here. The reply time is still to be set:
// the brief's placeholder "[two]" is kept visible on purpose.
export default {
  seo: {
    title: 'Request a Demo | Predicterra',
    description:
      'See your assets in the Cognitive Twin. Tell us the first problem you want to solve, and an engineer will get back to you.',
  },
  hero: {
    label: 'Request a demo',
    title: 'See your system in the Cognitive Twin.',
    text: 'Tell us the first problem you want to solve. An engineer will get back to you within [two] business days.',
  },
  form: {
    name: 'Name',
    email: 'Work email',
    company: 'Company',
    role: 'Role',
    sector: 'Sector',
    sectorPlaceholder: 'Choose a sector',
    sectors: ['Grid', 'Solar', 'Wind', 'Oil & Gas', 'Other'],
    problem: 'What would you like to solve first?',
    news: 'I’d like to receive news and updates from Predicterra.',
    optional: 'Optional',
    submit: 'Request a demo',
    legal:
      'Predicterra SL will use your data to answer your request. You can access, rectify or erase it, and exercise your other rights, as explained in our',
    legalLink: { label: 'Privacy Policy', href: routes.privacy },
  },
  other: {
    title: 'Prefer to write?',
    email: 'hello@predicterra.com',
    phones: [
      { label: 'EU', value: '+34 900 752 605', href: 'tel:+34900752605' },
      { label: 'USA', value: '+1 929-323-2391', href: 'tel:+19293232391' },
    ],
    address: 'BAT Acceleration Tower, Gran Vía 1, 48001 Bilbao',
  },
  done: {
    title: 'Thanks, we’ve received your request.',
    text: 'An engineer will get back to you within [two] business days. In the meantime, see how the platform works.',
    link: { label: 'See the platform', href: routes.platform },
  },
} as const;
