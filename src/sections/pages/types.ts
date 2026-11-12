import type { IconName } from '../../data/icons';
import type { LogoGroup } from '../../i18n/en/pages-shared';

export interface Link {
  label: string;
  href: string;
  external?: boolean;
}

export interface Hero {
  label: string;
  title: string;
  text: string;
  primary: Link;
  secondary: Link;
  /** Brief's [VISUAL] note, shown in the placeholder until the real asset exists. */
  visual: string;
  /** Layout, so the pages don't all open the same way. */
  layout: 'stack' | 'split' | 'split-reverse' | 'centred';
}

export interface Stat {
  value: string;
  text: string;
  link?: Link;
}

export interface Figure {
  value: string;
  text: string;
}

export interface Context {
  title: string;
  text: string;
  figures?: Figure[];
  /** Sources shown in small type under the figures. */
  sources?: string;
  quote?: string;
  visual: string;
}

export interface Asset {
  icon: IconName;
  title: string;
  text: string;
}

export interface Models {
  title: string;
  text: string;
  assets: Asset[];
  hazards: string[];
  compound: string;
}

export interface UseCase {
  title: string;
  text: string;
}

export interface Team {
  name: string;
  horizon: string;
  text: string;
  useCases: UseCase[];
  metric: string;
  shot: string;
}

export interface Works {
  title: string;
  text: string;
  extra?: string;
  reads: string[];
  returns: string[];
  closing: string;
}

export interface ResultRow {
  report: string;
  change: string;
}

export interface SystemNode {
  label: string;
  href?: string;
}

export interface SectorCopy {
  seo: { title: string; description: string };
  hero: Hero;
  logos: LogoGroup[];
  proof: { items: Stat[]; backing?: { text: string; link: Link }; links?: Link[] };
  ahead: Context;
  models: Models;
  teams: { title: string; items: Team[] };
  works: Works;
  results: { title: string; text: string; rows: ResultRow[] };
  system: { title: string; text: string; center: string; nodes: SystemNode[] };
  start: {
    title: string;
    text: string;
    steps: UseCase[];
    guide?: { ready: boolean; text: string; link: Link };
  };
  cta: {
    titleLine1: string;
    titleLine2: string;
    titleAccent: string;
    text: string;
    primary: Link;
    secondary?: Link;
  };
}
