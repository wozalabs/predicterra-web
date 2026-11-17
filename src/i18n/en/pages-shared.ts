import { routes } from '../../data/routes';

// Pieces repeated word for word across the pages (briefs of November 2026).
// Change them here and every page follows.

export const actions = {
  demo: { label: 'Request a demo', href: routes.demo },
  platform: { label: 'See the platform', href: routes.platform },
  engineer: { label: 'Talk to an engineer', href: routes.engineer, external: false },
} as const;

/** Logos for the band under the heroes. Files in public/logos; E.DSO has none yet, so it is set as text. */
export const logo = {
  iberdrola: { name: 'Iberdrola', src: '/logos/iberdrola.svg', w: 109, h0: 27, h: 22 },
  naturgy: { name: 'UFD, Grupo Naturgy', src: '/logos/ufd.svg', w: 848, h0: 512, h: 34 },
  edso: { name: 'E.DSO' },
  moeve: { name: 'Moeve Light Up', src: '/logos/moeve.svg', w: 109, h0: 20, h: 16 },
  azure: { name: 'Microsoft Azure Marketplace', src: '/logos/microsoft-partner.svg', w: 1352, h0: 350, h: 26 },
  bind: { name: 'BIND 4.0', src: '/logos/bind.svg', w: 1305, h0: 256, h: 20 },
} as const;

export type LogoItem = { name: string; src?: string; w?: number; h0?: number; h?: number };
export type LogoGroup = { label: string; items: readonly LogoItem[] };

/** The home's logo strip: clients in operation, then recognition. */
export const logoBand: LogoGroup[] = [
  { label: 'In operation with', items: [logo.iberdrola, logo.naturgy] },
  { label: 'Recognized by', items: [logo.edso, logo.moeve, logo.azure] },
];

/** CTA card copy: the title split so the last words carry the orange. */
export const cta = (
  line1: string,
  line2: string,
  accent: string,
  text = 'Start with one problem, on your own data. Grow across teams and sectors on the same model.',
) => ({
  titleLine1: line1,
  titleLine2: line2,
  titleAccent: accent,
  text,
  primary: actions.demo,
  secondary: actions.engineer,
});

export const cases = {
  all: { label: 'See the cases', href: routes.cases },
};
