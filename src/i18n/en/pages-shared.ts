import { routes } from '../../data/routes';

// Pieces repeated word for word across the pages (final copy, November 2026,
// "predicterra-00-base.md"). Change them here and every page follows.

export const actions = {
  demo: { label: 'Get started', href: routes.demo },
  platform: { label: 'See the platform', href: routes.platform },
  engineer: { label: 'Talk to an engineer', href: routes.engineer, external: false },
} as const;

/** Logos for the bands (files in public/logos). `h` balances them optically:
 *  equal ink area, eased for density (measured from the files). */
export const logo = {
  iberdrola: { name: 'Iberdrola', src: '/logos/iberdrola.svg', w: 109, h0: 27, h: 24 },
  gsgih: { name: 'Iberdrola Global Smart Grids Innovation Hub', src: '/logos/gsgih.svg', w: 830, h0: 180, h: 30 },
  naturgy: { name: 'UFD, Grupo Naturgy', src: '/logos/ufd.svg', w: 848, h0: 512, h: 37 },
  moeve: { name: 'Moeve', src: '/logos/moeve.svg', w: 109, h0: 20, h: 18 },
  edso: { name: 'E.DSO', src: '/logos/edso.svg', w: 675, h0: 222, h: 31 },
  futured: { name: 'FutuRed', src: '/logos/futured.svg', w: 959, h0: 546, h: 40 },
  azure: { name: 'Microsoft Azure Marketplace', src: '/logos/microsoft-partner.svg', w: 1352, h0: 350, h: 22 },
  bind: { name: 'BIND 4.0', src: '/logos/bind.svg', w: 1305, h0: 256, h: 22 },
} as const;

export type LogoItem = { name: string; src?: string; w?: number; h0?: number; h?: number };
export type LogoGroup = { label: string; items: readonly LogoItem[] };

/** Clients in operation and recognition, as listed in the base document. */
export const logoBand: LogoGroup[] = [
  { label: 'Trusted by', items: [logo.iberdrola, logo.gsgih, logo.naturgy, logo.moeve] },
  { label: 'Recognized by', items: [logo.edso, logo.futured, logo.azure] },
];

/** Logo band with its line and the link to the cases (home). */
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
  /** Home. */
  standard: { groups: logoBand, text: twoNetworks, link: cases.all } satisfies Proof,
};

/** The closing card on every page: one title and one button. */
export const cta = {
  title: 'Explore Predicterra',
  primary: actions.demo,
};
