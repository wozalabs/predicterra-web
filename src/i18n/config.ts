import en from './en';

export const locales = ['en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

const dictionaries = { en } satisfies Record<Locale, typeof en>;

/** Returns the full copy dictionary for a locale. */
export function getCopy(locale: Locale = defaultLocale) {
  return dictionaries[locale] ?? dictionaries[defaultLocale];
}

/** Prefixes a route with the locale segment (none for the default locale). */
export function localizePath(path: string, locale: Locale = defaultLocale) {
  if (locale === defaultLocale || /^(https?:|mailto:|tel:|#)/.test(path)) return path;
  return `/${locale}${path === '/' ? '' : path}`;
}
