import type { IconName } from '../../data/icons';

export interface Link {
  label: string;
  href: string;
  external?: boolean;
}

export interface Stat {
  value: string;
  text: string;
  link?: Link;
}

export interface Block {
  icon?: IconName;
  title: string;
  text: string;
}

export interface CtaCopy {
  titleLine1: string;
  titleLine2: string;
  titleAccent: string;
  text: string;
  primary: Link;
  secondary?: Link;
}

/** Grid, Solar, Wind, Oil & Gas: hero · metrics · what we do · why · claim and CTA. */
export interface SectorCopy {
  seo: { title: string; description: string };
  hero: { label: string; title: string; text: string; primary: Link; secondary: Link };
  /** The sector's asset from the homepage 3D scene, turning in the hero. */
  asset: 'grid' | 'solar' | 'wind' | 'oilgas';
  metrics: { items: Stat[]; backing?: { text: string; link: Link }; link?: Link };
  what: { title: string; text: string; uses: string[] };
  why: { title: string; items: Block[] };
  cta: CtaCopy;
}
