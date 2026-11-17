import { cta } from './pages-shared';

// /cases, from "predicterra-10-cases.md". Copy word for word; eyebrows left out.
// Pending: signed quotes, the i-DE case PDF and the link to the E.DSO case.
// Until they exist, the quote and the links are left out.
export default {
  seo: {
    title: 'Customer Cases: i-DE and UFD | Predicterra',
    description:
      'How two of Spain’s largest distribution networks use Predicterra: 73% faster response to climate events at i-DE, and 116,000 km of UFD’s grid in one model.',
  },
  hero: {
    label: 'Cases',
    title: 'In operation today.',
    text: 'Two of Spain’s largest distribution networks already use Predicterra.',
  },
  cases: [
    {
      id: 'ide',
      client: 'i-DE · Iberdrola',
      logo: { src: '/logos/iberdrola.svg', w: 109, h0: 27, h: 24 },
      value: '73%',
      title: 'faster response to climate events.',
      blocks: [
        {
          title: 'The challenge',
          text: 'See storm impact span by span, across 85,000 km of overhead lines, before it reaches the network.',
        },
        { title: 'What Predicterra does', text: 'Ranks every span by failure risk ahead of each event.' },
        { title: 'The result', text: 'Crews in place before the storm hits, not after the first call.' },
        {
          title: 'Recognition',
          text: 'Winner of Iberdrola’s PERSEO challenge. Technical paper co-published with i-DE at the FutuRed Smart Grids Congress.',
        },
      ],
    },
    {
      id: 'ufd',
      client: 'UFD · Naturgy',
      logo: { src: '/logos/ufd.svg', w: 848, h0: 512, h: 36 },
      value: '116,000 km',
      title: 'of grid in one model.',
      blocks: [
        { title: 'The challenge', text: 'Anticipate climate risk asset by asset, days before each event.' },
        {
          title: 'What Predicterra does',
          text: 'Models 116,000 km of grid in one ontology, with risk for every asset up to 14 days ahead.',
        },
        { title: 'The result', text: 'Forecasts validated against ten years of real incidents.' },
        { title: 'Recognition', text: 'Published by E.DSO as a success case.' },
      ],
    },
  ],
  recognition: {
    title: 'Recognition',
    items: [
      { name: 'Iberdrola PERSEO', text: 'Winner', logo: { src: '/logos/iberdrola.svg', w: 109, h0: 27, h: 22 } },
      { name: 'BIND 4.0', text: 'Winner, with the Basque Energy Agency', logo: { src: '/logos/bind.svg', w: 1305, h0: 256, h: 20 } },
      { name: 'Moeve Light Up', text: 'One of nine deep-science startups', logo: { src: '/logos/moeve.svg', w: 109, h0: 20, h: 18 } },
      { name: 'E.DSO', text: 'Success case' },
      { name: 'FutuRed', text: 'Paper co-published with i-DE' },
      {
        name: 'Microsoft Azure Marketplace',
        text: 'Available on the marketplace',
        logo: { src: '/logos/microsoft-partner.svg', w: 1352, h0: 350, h: 26 },
      },
    ],
  },
  cta: cta('See your system', 'in the', 'Cognitive Twin.'),
} as const;
