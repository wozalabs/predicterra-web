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
  /** Dithered field on the ground around the asset at risk. */
  hazard: string;
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
  hazard: '#FF3700',
};

const DARK: ScenePalette = {
  bg: '#0D0D0D',
  gridDot: '#262626',
  shadow: '#050505',
  asset: '#3A3A3A',
  line: '#3D3D3D',
  deco: '#222222',
  stream: '#151515',
  idle: '#3D3D3D',
  ctaGround: '#1A1A1A',
  // Quiet grey, a step above the assets: the asset itself carries the orange.
  hazard: '#4A4A4A',
};

export const scenePalette = (): ScenePalette => (isDarkTheme() ? DARK : LIGHT);
