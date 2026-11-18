/**
 * Site theme: dark by default, light on request. The choice is set on <html>
 * (data-theme) before first paint by BaseLayout and remembered in localStorage.
 * Everything that draws its own colours (scroll scrubs, header, 3D scenes)
 * listens for the `theme:change` event.
 */
export type Theme = 'dark' | 'light';
export const THEME_KEY = 'predicterra:theme';
export const THEME_EVENT = 'theme:change';

export const currentTheme = (): Theme => (document.documentElement.dataset.theme === 'light' ? 'light' : 'dark');
export const isDarkTheme = () => currentTheme() === 'dark';

export function setTheme(theme: Theme) {
  const root = document.documentElement;
  if (root.dataset.theme === theme) return;
  // One frame without transitions, so the switch is a clean cut, not a cascade.
  root.classList.add('theme-switching');
  root.dataset.theme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#0D0D0D' : '#FAFAFA');
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    /* storage unavailable: applies to this page view only */
  }
  window.dispatchEvent(new Event(THEME_EVENT));
  window.dispatchEvent(new Event('header:refresh'));
  requestAnimationFrame(() => requestAnimationFrame(() => root.classList.remove('theme-switching')));
}

export function onThemeChange(cb: (theme: Theme) => void) {
  window.addEventListener(THEME_EVENT, () => cb(currentTheme()));
}
