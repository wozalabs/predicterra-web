import type { IconName } from '../../data/icons';
import type { Proof } from '../../i18n/en/pages-shared';

export interface Link {
  label: string;
  href: string;
  external?: boolean;
}

export interface Stat {
  value: string;
  text: string;
  /** A short line under the label (Platform: what each figure means). */
  note?: string;
}

export interface Block {
  icon?: IconName;
  title: string;
  text: string;
}

export interface CtaCopy {
  title: string;
  primary: Link;
}

/**
 * The seven Solutions pages share one structure ("predicterra-00-mapa-web.md"):
 * hero · logos · metrics · the solution · use cases or sectors · CTA.
 * Sector pages (Grid, Solar, Wind, Oil & Gas) show their asset from the home's
 * 3D scene in the hero; the pages across all sectors open on type alone.
 */
export interface SolutionCopy {
  seo: { title: string; description: string };
  hero: { title: string; text: string; primary: Link; secondary?: Link };
  asset?: 'grid' | 'solar' | 'wind' | 'oilgas';
  proof: Proof;
  metrics: Stat[];
  solution: {
    title: string;
    paragraphs?: string[];
    /** Context figures, before the text (Grid) or after it (Resilience). */
    figures?: Stat[];
    figuresFirst?: boolean;
    /** Two-column table (Compliance: framework · what you get). */
    table?: { head: [string, string]; rows: [string, string][] };
    sources?: string;
  };
  list: {
    title: string;
    /** uses: six use cases; sectors: four linked sectors. */
    kind: 'uses' | 'sectors';
    items: { title: string; text: string; href?: string }[];
  };
  cta: CtaCopy;
}
