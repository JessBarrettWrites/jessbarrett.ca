import { afterEach, describe, it, expect, vi } from 'vitest'
import {
  DEFAULT_LOCALE,
  LOCALE_STORAGE_KEY,
  localePath,
  localizeHref,
  preferredLocale,
} from '@/locale'

describe('localePath', () => {
  it('prefixes page paths', () => {
    expect(localePath('fr', '/books')).toBe('/fr/books')
  })

  it('maps the home page to the bare locale', () => {
    expect(localePath('en', '/')).toBe('/en')
  })
})

describe('localizeHref', () => {
  it('prefixes root-relative page links, keeping the hash and query', () => {
    expect(localizeHref('/books#no-place-like-home', 'fr')).toBe('/fr/books#no-place-like-home')
    expect(localizeHref('/talks?x=1', 'fr')).toBe('/fr/talks?x=1')
    expect(localizeHref('/', 'fr')).toBe('/fr')
  })

  it('leaves links that already have a locale', () => {
    expect(localizeHref('/en/books', 'fr')).toBe('/en/books')
    expect(localizeHref('/fr', 'en')).toBe('/fr')
  })

  it('leaves files, external, protocol-relative, and fragment links', () => {
    expect(localizeHref('/images/cover.jpg', 'fr')).toBe('/images/cover.jpg')
    expect(localizeHref('https://example.com/books', 'fr')).toBe('https://example.com/books')
    expect(localizeHref('//example.com/books', 'fr')).toBe('//example.com/books')
    expect(localizeHref('#top', 'fr')).toBe('#top')
    expect(localizeHref('mailto:a@example.com', 'fr')).toBe('mailto:a@example.com')
  })
})

describe('preferredLocale', () => {
  afterEach(() => {
    localStorage.removeItem(LOCALE_STORAGE_KEY)
    vi.restoreAllMocks()
  })

  it('uses the last locale viewed', () => {
    localStorage.setItem(LOCALE_STORAGE_KEY, 'fr')
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
