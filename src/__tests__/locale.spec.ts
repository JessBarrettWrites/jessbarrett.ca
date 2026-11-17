import { afterEach, describe, it, expect, vi } from 'vitest'
import {
  DEFAULT_LOCALE,
  formatDate,
  formatLongDate,
  formatMonth,
  formatNumber,
  formatTime,
  isCrawler,
  LOCALE_COOKIE,
  localePath,
  preferredLocale,
  saveLocale,
  selectedLocale,
} from '@/locale'

function clearCookie() {
  document.cookie = `${LOCALE_COOKIE}=; path=/; max-age=0`
}

describe('localePath', () => {
  it('prefixes page paths', () => {
    expect(localePath('fr', '/books')).toBe('/fr/books')
  })

  it('maps the home page to the bare locale', () => {
    expect(localePath('en', '/')).toBe('/en')
  })
})

describe('selectedLocale', () => {
  afterEach(clearCookie)

  it('reads the locale saved by saveLocale', () => {
    expect(selectedLocale()).toBeUndefined()
    saveLocale('es')
    expect(selectedLocale()).toBe('es')
  })

  it('ignores unknown locales', () => {
    document.cookie = `${LOCALE_COOKIE}=de; path=/`
    expect(selectedLocale()).toBeUndefined()
  })
})

describe('preferredLocale', () => {
  afterEach(() => {
    clearCookie()
    vi.restoreAllMocks()
  })

  it('uses the chosen locale over the browser languages', () => {
    vi.spyOn(navigator, 'languages', 'get').mockReturnValue(['es-MX'])
    saveLocale('fr')
    expect(preferredLocale()).toBe('fr')
  })

  it('falls back to the first supported browser language', () => {
    vi.spyOn(navigator, 'languages', 'get').mockReturnValue(['de-DE', 'fr-CA', 'en-US'])
    expect(preferredLocale()).toBe('fr')
    vi.spyOn(navigator, 'languages', 'get').mockReturnValue(['es-MX', 'en-US'])
    expect(preferredLocale()).toBe('es')
  })

  it('falls back to the default locale', () => {
    vi.spyOn(navigator, 'languages', 'get').mockReturnValue(['de-DE'])
    expect(preferredLocale()).toBe(DEFAULT_LOCALE)
  })
})

describe('isCrawler', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('detects search engine crawlers', () => {
    vi.spyOn(navigator, 'userAgent', 'get').mockReturnValue(
      'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
    )
    expect(isCrawler()).toBe(true)
  })

  it('passes regular browsers', () => {
    vi.spyOn(navigator, 'userAgent', 'get').mockReturnValue(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 Version/18.0 Safari/605.1.15',
    )
    expect(isCrawler()).toBe(false)
  })
})

describe('formatting', () => {
  // Local time, as content dates are
  const date = new Date(2026, 10, 22, 10, 0)

  it('writes dates in the page language, not the browser’s', () => {
    expect(formatDate(date, 'en')).toBe('November 22, 2026')
    expect(formatDate(date, 'fr')).toBe('22 novembre 2026')
    expect(formatDate(date, 'es')).toBe('22 de noviembre de 2026')
  })

  it('writes a day with its weekday', () => {
    expect(formatLongDate(date, 'en')).toBe('Sunday, November 22, 2026')
  })

  it('writes times and months', () => {
    expect(formatTime(date, 'en')).toMatch(/^10:00\sa\.m\.$/)
    expect(formatMonth(date, 'en')).toBe('Nov')
  })

  it('writes numbers', () => {
    expect(formatNumber(1002, 'en')).toBe('1,002')
    expect(formatNumber(1002, 'fr')).toMatch(/^1\s002$/)
  })
})
