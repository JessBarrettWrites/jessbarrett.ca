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

// Cookie holding the language the visitor chose in the language menu
export const LOCALE_COOKIE = 'locale'
const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365

/* Accept the value as unknown, and validate it as a real Locale (string) on return */
export function isLocale(value: unknown): value is Locale {
  return LOCALES.includes(value as Locale)
}

/** Path of a page's search engine copy in a locale, e.g. `localePath('fr', '/books')` → `/fr/books` */
export function localePath(locale: Locale, path: string): string {
  return path === '/' ? `/${locale}` : `/${locale}${path}`
}

/** The locale chosen in the language menu, if any */
export function selectedLocale(): Locale | undefined {
  if (typeof document === 'undefined') {
    // Document isn't available, so nothing to search for
    return undefined
  }
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${LOCALE_COOKIE}=([^;]*)`))
  return isLocale(match?.[1]) ? match[1] : undefined
}

/** Remember the locale chosen in the language menu */
export function saveLocale(locale: Locale): void {
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=${LOCALE_COOKIE_MAX_AGE}; SameSite=Lax`
}

/** The locale a visitor most likely wants: the one they chose, then their browser languages */
export function preferredLocale(): Locale {
  const selected = selectedLocale()
  if (selected) return selected
  const languages = typeof navigator === 'undefined' ? [] : navigator.languages
  for (const language of languages) {
    const base = language.split('-')[0]
    if (isLocale(base)) return base
  }
  return DEFAULT_LOCALE
}

// DEV NOTE: Dates and numbers are written in the page's language, not the browser's

/** A date as the locale writes it in full, e.g. "November 13, 2026" */
export function formatDate(date: Date, locale: Locale): string {
  return new Intl.DateTimeFormat(LOCALE_TAGS[locale], { dateStyle: 'long' }).format(date)
}

/** A day as the locale writes it with its weekday, e.g. "Sunday, November 22, 2026" */
export function formatLongDate(date: Date, locale: Locale): string {
  return new Intl.DateTimeFormat(LOCALE_TAGS[locale], { dateStyle: 'full' }).format(date)
}

/** A time of day as the locale writes it, e.g. "10:00 a.m." */
export function formatTime(date: Date, locale: Locale): string {
  return new Intl.DateTimeFormat(LOCALE_TAGS[locale], { timeStyle: 'short' }).format(date)
}

/** A date's month, abbreviated, e.g. "Nov" */
export function formatMonth(date: Date, locale: Locale): string {
  return new Intl.DateTimeFormat(LOCALE_TAGS[locale], { month: 'short' }).format(date)
}

/** A whole number as the locale writes it, e.g. "1,002" */
export function formatNumber(value: number, locale: Locale): string {
  return new Intl.NumberFormat(LOCALE_TAGS[locale]).format(value)
}

/** Whether the visitor is a search engine or other crawler, which reads each locale's own pages */
export function isCrawler(): boolean {
  if (typeof navigator === 'undefined') return false
  return /bot|crawl|spider|slurp|lighthouse/i.test(navigator.userAgent)
}

// DEV NOTE: App.vue provides the locale being shown; components rendered without it (tests, CMS
//           previews before they provide one) get the default locale
export const LOCALE_KEY: InjectionKey<Readonly<Ref<Locale>>> = Symbol('locale')

export function useLocale(): Readonly<Ref<Locale>> {
  return inject(LOCALE_KEY, ref(DEFAULT_LOCALE))
}

// DEV NOTE: App.vue provides this to switch the page's locale in place; without it (tests, CMS
//           previews) choosing a language does nothing
export const SELECT_LOCALE_KEY: InjectionKey<(locale: Locale) => void> = Symbol('selectLocale')

export function useSelectLocale(): (locale: Locale) => void {
  return inject(SELECT_LOCALE_KEY, () => {})
}
