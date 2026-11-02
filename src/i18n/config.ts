import en from './en';

export const locales = ['en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

const dictionaries = { en } satisfies Record<Locale, typeof en>;

/** Returns the full copy dictionary for a locale. */
export function getCopy(locale: Locale = defaultLocale) {
  return dictionaries[locale] ?? dictionaries[defaultLocale];
}

const isExternal = (path: string) => /^(https?:|mailto:|tel:|#)/.test(path);

/**
 * Prefixes a root-relative path with the site base. The base is `/` in
 * production and `/predicterra-web/` on the GitHub Pages preview.
 */
export function withBase(path: string) {
  if (isExternal(path) || !path.startsWith('/')) return path;
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}${path}` || '/';
}

/** Prefixes a route with the locale segment (none for the default locale) and the site base. */
export function localizePath(path: string, locale: Locale = defaultLocale) {
  if (isExternal(path)) return path;
  if (locale === defaultLocale) return withBase(path);
  return withBase(`/${locale}${path === '/' ? '' : path}`);
}
