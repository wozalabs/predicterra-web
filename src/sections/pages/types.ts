import type { IconName } from '../../data/icons';

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
