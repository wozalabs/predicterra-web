/**
 * Test switch: alternative global typefaces, picked from the header.
 * All Google Fonts, regular (400) only, none monospaced. Archivo (the brand
 * font, self-hosted) is the default; the others load from Google Fonts only
 * when chosen. Remove this file and the header select once one is chosen.
 */
const families = [
  'Archivo',
  'Inter Tight',
  'Geist',
  'Instrument Sans',
  'Host Grotesk',
  'Schibsted Grotesk',
  'Hanken Grotesk',
  'Mona Sans',
  'Funnel Display',
  'Familjen Grotesk',
  'IBM Plex Sans',
  'Space Grotesk',
  'Onest',
] as const;

export const FONT_KEY = 'predicterra:font';

export const testFonts = families.map((name) => {
  const id = name.toLowerCase().replace(/\s+/g, '-');
  return {
    id,
    name,
    // Archivo stays on the self-hosted variable font from tokens.css.
    href: id === 'archivo' ? '' : `https://fonts.googleapis.com/css2?family=${name.replace(/\s+/g, '+')}:wght@400&display=swap`,
    stack: `'${name}', 'Archivo Fallback', system-ui, sans-serif`,
  };
});
