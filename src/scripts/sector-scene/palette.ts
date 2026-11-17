/**
 * Colours of the 3D scenes (sector section, asset panel view, CTA card) for each
 * theme. Light: white assets on the near-white page. Dark: dark grey assets, a few
 * steps above the dark canvas so they stay clear, darker dithered shadows; the orange stays the same.
 */
import { isDarkTheme } from '../theme';

export interface ScenePalette {
  /** Ground and clear colour: the page canvas, so the plane disappears into it. */
  bg: string;
  gridDot: string;
  shadow: string;
  asset: string;
  line: string;
  deco: string;
  stream: string;
  idle: string;
  /** CTA card ground (a step off the page canvas). */
  ctaGround: string;
}

const LIGHT: ScenePalette = {
  bg: '#FAFAFA',
  gridDot: '#C9C9C9',
  shadow: '#A7A7A7',
  asset: '#FFFFFF',
  line: '#BDBDBD',
  deco: '#D2D2D2',
  stream: '#D6D6D6',
  idle: '#BDBDBD',
  ctaGround: '#EAEAEA',
};

const DARK: ScenePalette = {
  bg: '#161616',
  gridDot: '#303030',
  shadow: '#0B0B0B',
  asset: '#3A3A3A',
  line: '#3D3D3D',
  deco: '#2A2A2A',
  stream: '#1F1F1F',
  idle: '#3D3D3D',
  ctaGround: '#1E1E1E',
};

export const scenePalette = (): ScenePalette => (isDarkTheme() ? DARK : LIGHT);
