import { routes } from '../../data/routes';
import { casePath } from './cases';

// Pieces repeated word for word across the platform, solutions and sector pages
// (briefs of November 2026). Change them here and every page follows.

export const actions = {
  demo: { label: 'Request a demo', href: routes.demo },
  platform: { label: 'See the platform', href: routes.platform },
  engineer: { label: 'Talk to an engineer', href: routes.contact, external: false },
  methodology: { label: 'Read the methodology', href: `${routes.platform}#validation` },
} as const;

/** Logos for the band under the heroes. Files in public/logos; E.DSO has none yet, so it is set as text. */
export const logo = {
  iberdrola: { name: 'Iberdrola', src: '/logos/iberdrola.svg', w: 109, h0: 27, h: 22 },
  naturgy: { name: 'UFD, Grupo Naturgy', src: '/logos/ufd.svg', w: 848, h0: 512, h: 34 },
  edso: { name: 'E.DSO' },
  moeve: { name: 'Moeve Light Up', src: '/logos/moeve.svg', w: 109, h0: 20, h: 16 },
  azure: { name: 'Microsoft Azure Marketplace', src: '/logos/microsoft-partner.svg', w: 1352, h0: 350, h: 26 },
} as const;

export type LogoItem = { name: string; src?: string; w?: number; h0?: number; h?: number };
export type LogoGroup = { label: string; items: readonly LogoItem[] };

export const logoBands = {
  /** Deployments are grid deployments: on Platform, Grid and the cross-sector pages they read as "with". */
  standard: [
    { label: 'In operation with', items: [logo.iberdrola, logo.naturgy] },
    { label: 'Recognized by', items: [logo.edso, logo.moeve, logo.azure] },
  ],
  grid: [
    { label: 'In operation with', items: [logo.iberdrola, logo.naturgy] },
    { label: 'Recognized by', items: [logo.edso, logo.azure] },
  ],
  /** Solar, Wind: "on the grids of", so Iberdrola and Naturgy don't read as solar or wind clients. */
  onGrids: [
    { label: 'In operation on the grids of', items: [logo.iberdrola, logo.naturgy] },
    { label: 'Recognized by', items: [logo.edso, logo.moeve, logo.azure] },
  ],
  oilGas: [
    { label: 'In operation on the grids of', items: [logo.iberdrola, logo.naturgy] },
    { label: 'Recognized by', items: [logo.moeve, logo.edso, logo.azure] },
  ],
} satisfies Record<string, LogoGroup[]>;

/** The same "how to start" everywhere, so it matches the CTA. Only the object of "connect it to" changes. */
export const howToStart = (to: string) => ({
  title: 'Start with one problem. Grow on the same model.',
  text: `Predicterra is a licensed platform, not a custom project. Our Earth System Engineers connect it to ${to}, and your first problem runs on your own data in weeks.`,
  steps: [
    {
      title: 'Pick a problem',
      text: 'One team, one hazard, one region. We agree the success metric with you before we start.',
    },
    { title: 'Prove it on your data', text: 'The twin runs on your assets and is measured against your own incidents.' },
    { title: 'Expand', text: 'New teams, hazards and sectors on the same licensed platform. Nothing is rebuilt.' },
  ],
});

/** CTA card copy: the title split so the last words carry the orange. */
export const cta = (line1: string, line2: string, accent: string) => ({
  titleLine1: line1,
  titleLine2: line2,
  titleAccent: accent,
  text: 'Start with one problem, on your own data. Grow across teams and sectors on the same model.',
  primary: actions.demo,
  secondary: actions.engineer,
});

export const cases = {
  ide: { label: 'Read the i-DE case', href: casePath('iberdrola') },
  ufd: { label: 'Read the UFD case', href: casePath('naturgy') },
  all: { label: 'See the cases', href: routes.cases },
};

export const sectorLinks = {
  grid: { label: 'Grid', href: routes.sectors.grid, icon: 'electrical_services' },
  solar: { label: 'Solar', href: routes.sectors.solar, icon: 'solar_power' },
  wind: { label: 'Wind', href: routes.sectors.wind, icon: 'wind_power' },
  oilGas: { label: 'Oil & Gas', href: routes.sectors.oilGas, icon: 'oil_barrel' },
} as const;

/** Six hazards, the same on every page; each sector orders them its own way. */
export const timeline = ['Today', '14 days', '1 year', '10 years', '2050', '2100'];
