import { inject, ref } from 'vue'
import type { InjectionKey, Ref } from 'vue'

export const LOCALES = ['en', 'fr', 'es'] as const
export type Locale = (typeof LOCALES)[number]

export const DEFAULT_LOCALE: Locale = 'en'

// BCP 47 tags for <html lang>, hreflang, og:locale and date formatting. Spanish has no region: it's
// written as neutral Spanish for readers anywhere
export const LOCALE_TAGS: Record<Locale, string> = { en: 'en-CA', fr: 'fr-CA', es: 'es' }
export const LOCALE_NAMES: Record<Locale, string> = {
  en: 'English',
  fr: 'Français',
  es: 'Español',
}

export function isLocale(value: unknown): value is Locale {
  return LOCALES.includes(value as Locale)
}

// Key in localStorage for the last locale the visitor viewed, used by unprefixed URLs
export const LOCALE_STORAGE_KEY = 'locale'

/** Path of a page in a locale, e.g. `localePath('fr', '/books')` → `/fr/books` */
export function localePath(locale: Locale, path: string): string {
  return path === '/' ? `/${locale}` : `/${locale}${path}`
}

/** Prefix a root-relative page link (e.g. `/books#slug` in Markdown content) with the locale. Links
 *  that already have a locale, protocol-relative links and files (`/images/a.jpg`) are left alone. */
export function localizeHref(href: string, locale: Locale): string {
  if (!href.startsWith('/') || href.startsWith('//')) return href
  const [path = '/', ...rest] = href.split(/(?=[?#])/)
  const segment = path.split('/')[1] ?? ''
  if (isLocale(segment) || path.includes('.')) return href
  return localePath(locale, path) + rest.join('')
}

/** The locale a visitor most likely wants: the last one they viewed, then their browser languages */
export function preferredLocale(): Locale {
  try {
    const saved = localStorage.getItem(LOCALE_STORAGE_KEY)
    if (isLocale(saved)) return saved
  } catch {
    // Storage may be unavailable; fall back to the browser languages
  }
  const languages = typeof navigator === 'undefined' ? [] : navigator.languages
  for (const language of languages) {
    const base = language.split('-')[0]
    if (isLocale(base)) return base
  }
  return DEFAULT_LOCALE
}

// DEV NOTE: App.vue provides the current route's locale; components rendered without it (tests, CMS
//           previews before they provide one) get the default locale
export const LOCALE_KEY: InjectionKey<Readonly<Ref<Locale>>> = Symbol('locale')

export function useLocale(): Readonly<Ref<Locale>> {
  return inject(LOCALE_KEY, ref(DEFAULT_LOCALE))
}
