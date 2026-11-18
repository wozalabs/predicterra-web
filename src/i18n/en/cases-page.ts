import { cta } from './pages-shared';
import { external } from '../../data/routes';

// /cases, from "predicterra-16-cases.md". Final copy; section eyebrows left out.
// Pending: the direct link to the UFD case on E.DSO (the success-case listing
// stands in), Moeve's figure and label (left out until validated with Moeve),
// signed quotes and the clients' permission.
export default {
  seo: {
    title: 'Customer Cases | Predicterra',
    description: 'How i-DE (Iberdrola), UFD (Naturgy) and Moeve work with Predicterra, the Cognitive Twin for energy.',
  },
  hero: {
    label: 'Cases',
    title: 'In operation today.',
    text: 'i-DE (Iberdrola), UFD (Naturgy) and Moeve already work with Predicterra.',
  },
  cases: [
    {
      id: 'ide',
      client: 'i-DE (Iberdrola)',
      logo: { src: '/logos/iberdrola.svg', w: 109, h0: 27, h: 24 },
      value: '73%',
      label: 'faster response to climate events',
      text: 'Span-level risk across 85,000 km of overhead lines, so crews are in place before the storm hits.',
      badge: 'PERSEO challenge winner',
      link: { label: 'Read the article', href: external.caseIde },
    },
    {
      id: 'ufd',
      client: 'UFD (Naturgy)',
      logo: { src: '/logos/ufd.svg', w: 848, h0: 512, h: 36 },
      value: '116,000 km',
      label: 'of grid in one model',
      text: 'Asset-level risk up to 14 days ahead, validated against ten years of real incidents.',
      badge: 'E.DSO success case',
      link: { label: 'Read the E.DSO case', href: external.caseUfd },
    },
    {
      id: 'moeve',
      client: 'Moeve',
      logo: { src: '/logos/moeve.svg', w: 109, h0: 20, h: 18 },
      text: 'AI and geospatial technology to manage information on renewable raw materials and sustainable fuels, piloted with Moeve in its Light Up accelerator.',
      badge: 'Moeve Light Up',
      link: { label: 'Read the article', href: external.caseMoeve },
    },
  ] as { id: string; client: string; logo: { src: string; w: number; h0: number; h: number }; value?: string; label?: string; text: string; badge: string; link: { label: string; href: string } }[],
  recognition: {
    title: 'Recognition',
    items: [
      { name: 'Iberdrola PERSEO', text: 'Winner' },
      { name: 'BIND 4.0', text: 'Winner with the Basque Energy Agency' },
      { name: 'Moeve Light Up', text: 'First edition' },
      { name: 'E.DSO', text: 'Success case' },
      { name: 'FutuRed', text: 'Paper co-published with i-DE' },
      { name: 'Microsoft Azure Marketplace' },
    ] as { name: string; text?: string }[],
  },
  cta: cta('See your system', 'in the', 'Cognitive Twin.'),
};
