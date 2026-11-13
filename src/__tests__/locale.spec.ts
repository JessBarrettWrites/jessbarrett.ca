import { afterEach, describe, it, expect, vi } from 'vitest'
import {
  DEFAULT_LOCALE,
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
