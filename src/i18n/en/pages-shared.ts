import { routes } from '../../data/routes';

// Pieces repeated word for word across the pages (final copy, November 2026,
// "predicterra-00-base.md"). Change them here and every page follows.

export const actions = {
  demo: { label: 'Request a demo', href: routes.demo },
  platform: { label: 'See the platform', href: routes.platform },
  engineer: { label: 'Talk to an engineer', href: routes.engineer, external: false },
} as const;

/** Logos for the bands (files in public/logos). */
export const logo = {
  iberdrola: { name: 'Iberdrola', src: '/logos/iberdrola.svg', w: 109, h0: 27, h: 22 },
  naturgy: { name: 'UFD, Grupo Naturgy', src: '/logos/ufd.svg', w: 848, h0: 512, h: 34 },
  moeve: { name: 'Moeve', src: '/logos/moeve.svg', w: 109, h0: 20, h: 16 },
  edso: { name: 'E.DSO', src: '/logos/edso.svg', w: 675, h0: 222, h: 34 },
  futured: { name: 'FutuRed', src: '/logos/futured.svg', w: 959, h0: 546, h: 38 },
  azure: { name: 'Microsoft Azure Marketplace', src: '/logos/microsoft-partner.svg', w: 1352, h0: 350, h: 26 },
  bind: { name: 'BIND 4.0', src: '/logos/bind.svg', w: 1305, h0: 256, h: 20 },
} as const;

export type LogoItem = { name: string; src?: string; w?: number; h0?: number; h?: number };
export type LogoGroup = { label: string; items: readonly LogoItem[] };

/** Clients in operation and recognition, as listed in the base document. */
export const logoBand: LogoGroup[] = [
  { label: 'Trusted by', items: [logo.iberdrola, logo.naturgy, logo.moeve] },
  { label: 'Recognized by', items: [logo.edso, logo.futured, logo.azure] },
];

/** Logo band with its line and the link to the cases (home and solution pages). */
export interface Proof {
  groups: LogoGroup[];
  text: string;
  link: { label: string; href: string };
}

export const cases = {
  all: { label: 'See the cases', href: routes.cases },
};

const twoNetworks = 'Two of Spain’s largest distribution networks already use Predicterra.';

export const proof = {
  /** Home, Resilience, Digitalization, Compliance. */
  standard: { groups: logoBand, text: twoNetworks, link: cases.all } satisfies Proof,
  grid: {
    groups: [
      { label: 'In operation with', items: [logo.iberdrola, logo.naturgy] },
      { label: 'Recognized by', items: [logo.edso, logo.azure] },
    ],
    text: twoNetworks,
    link: cases.all,
  } satisfies Proof,
  /** Solar and Wind: proven on the grids their plants export through. */
  onTheGrids: (assets: string): Proof => ({
    groups: [
      { label: 'In operation on the grids of', items: [logo.iberdrola, logo.naturgy] },
      { label: 'Recognized by', items: [logo.edso, logo.azure] },
    ],
    text: `Proven in operation on 116,000 km of Spanish distribution grid, the kind of network your ${assets}.`,
    link: cases.all,
  }),
  oilGas: {
    groups: [
      { label: 'In operation with', items: [logo.moeve] },
      { label: 'In operation on the grids of', items: [logo.iberdrola, logo.naturgy] },
      { label: 'Recognized by', items: [logo.edso, logo.azure] },
    ],
    text: 'Proven in operation on 116,000 km of Spanish distribution grid, the kind of network your sites depend on for power.',
    link: cases.all,
  } satisfies Proof,
};

/** The same closing line under every CTA title. */
export const ctaText = 'Start with one problem on your own data, and grow across teams and sectors on the same model.';

/** CTA card copy: the title split so the last words carry the orange. */
export const cta = (line1: string, line2: string, accent: string, text = ctaText) => ({
  titleLine1: line1,
  titleLine2: line2,
  titleAccent: accent,
  text,
  primary: actions.demo,
  secondary: actions.engineer,
});
