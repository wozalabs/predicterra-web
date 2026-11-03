import { routes, external } from '../../data/routes';

/**
 * Success stories. One entry per case: it feeds the homepage cards, the index
 * at /success-stories and the case page at /success-stories/<slug>.
 * Copy marked [Pending] is placeholder text to replace with the real case.
 * Images: set `image` ({ src, alt, w, h }, file in public/cases) when case
 * photography is ready; until then the frame is light grey.
 */

export interface CaseImage {
  src: string;
  alt: string;
  w: number;
  h: number;
}

export interface CaseStory {
  slug: string;
  client: string;
  sector: string;
  region: string;
  year: string;
  title: string;
  summary: string;
  image?: CaseImage;
  facts: { value: string; label: string }[];
  sections: { heading: string; paragraphs: string[] }[];
  quote?: { text: string; author: string; role: string };
  coverage?: { label: string; href: string };
}

// Placeholder article, same structure for every case until the real copy lands.
const pendingSections = (client: string): CaseStory['sections'] => [
  {
    heading: 'The challenge',
    paragraphs: [
      `[Pending] What ${client} needed to protect and what was at stake: the assets and network involved, the hazards they face, and the cost of an outage or a late decision.`,
      '[Pending] How the team worked before Predicterra: which data they relied on, how often it was updated, and where it fell short.',
    ],
  },
  {
    heading: 'The approach',
    paragraphs: [
      '[Pending] How Predicterra was deployed: which assets were modeled, which data feeds and operating systems it was connected to, and how long it took to go live.',
      '[Pending] What the platform does every day for the operator: the risks it forecasts, the alerts it raises and who acts on them.',
    ],
  },
  {
    heading: 'The results',
    paragraphs: [
      '[Pending] The measured outcome, with figures: response times, avoided incidents, hours or costs saved, coverage reached.',
      '[Pending] What comes next: the next regions, assets or teams that will run on the platform.',
    ],
  },
];

const pendingQuote = { text: '[Pending] A short quote from the operator’s team about the result.', author: '[Pending] Name', role: '[Pending] Role, company' };

const items: CaseStory[] = [
  {
    slug: 'iberdrola',
    client: 'Iberdrola',
    sector: 'Grid',
    region: '[Pending]',
    year: '[Pending]',
    title: 'Protecting 1.1M km of power line from the climate',
    summary:
      '[Pending] One or two sentences that sum up the case: the operator, the problem, and the result Predicterra delivered.',
    facts: [
      { value: '1.1M km', label: 'of power line in the challenge' },
      { value: '73%', label: 'faster response to climate events' },
    ],
    sections: pendingSections('Iberdrola'),
    quote: pendingQuote,
    coverage: { label: 'Read the coverage', href: external.iberdrolaCoverage },
  },
  {
    slug: 'naturgy',
    client: 'Naturgy',
    sector: '[Pending]',
    region: '[Pending]',
    year: '[Pending]',
    title: '[Pending] Case title for Naturgy',
    summary: '[Pending] One or two sentences that sum up the case: the operator, the problem, and the result Predicterra delivered.',
    facts: [
      { value: '[—]', label: '[Pending] Key result' },
      { value: '[—]', label: '[Pending] Key result' },
    ],
    sections: pendingSections('Naturgy'),
    quote: pendingQuote,
  },
  {
    slug: 'moeve',
    client: 'Moeve',
    sector: '[Pending]',
    region: '[Pending]',
    year: '[Pending]',
    title: '[Pending] Case title for Moeve',
    summary: '[Pending] One or two sentences that sum up the case: the operator, the problem, and the result Predicterra delivered.',
    facts: [
      { value: '[—]', label: '[Pending] Key result' },
      { value: '[—]', label: '[Pending] Key result' },
    ],
    sections: pendingSections('Moeve'),
    quote: pendingQuote,
  },
];

export default {
  // Index page
  seo: {
    title: 'Success stories | Predicterra',
    description:
      'How energy operators run their infrastructure on Predicterra: deployments, measured results and the networks protected from climate risk.',
  },
  hero: {
    eyebrow: 'Success stories',
    title: 'Chosen by the operators who cannot afford to be wrong.',
    text: 'Predicterra runs on real critical infrastructure. These are the deployments, and what they changed for the teams who operate them.',
  },
  listLabel: 'All success stories',

  // Case pages
  labels: {
    back: 'All success stories',
    client: 'Client',
    sector: 'Sector',
    region: 'Region',
    year: 'Year',
    keyFigures: 'Key figures',
    more: 'More success stories',
    moreTitle: 'Keep reading',
    readCase: 'Read the case',
  },

  items,

  cta: {
    label: 'Ready before the next event',
    titleLine1: 'Run your infrastructure',
    titleLine2: 'on',
    titleAccent: 'foresight.',
    text: 'One live system across every asset, every feed, every team. Act before the event, not after the report.',
    primary: { label: 'Request a demo', href: routes.demo },
  },
};

export const casePath = (slug: string) => `${routes.cases}/${slug}`;
