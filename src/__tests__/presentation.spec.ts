import { describe, it, expect } from 'vitest'
import { bookDateSort, articleDateSort, articleDateString, featuredBookFilter } from '@/presentation'
import { parseDate } from '@/parse'
import type { Book, JournalismArticle } from '@/types'

function makeBook(opts: { preorder?: string; available?: string }): Book {
  return {
    slug: 'test',
    title: 'Test',
    imageSrc: '/test.jpg',
    imageAlt: 'test',
    url: 'https://example.com',
    preorder: parseDate(opts.preorder),
    available: parseDate(opts.available),
    accolades: [],
    testimonials: [],
    body: '',
  }
}

function makeArticle(date: string): JournalismArticle {
  return {
    title: 'Test',
    publication: 'Test Pub',
    date: parseDate(date)!,
    url: 'https://example.com',
  }
}

describe('bookDateSort', () => {
  it('sorts books with earlier dates first', () => {
    const earlier = makeBook({ available: '2024-01-01' })
    const later = makeBook({ available: '2025-01-01' })
    expect(bookDateSort(earlier, later)).toBeLessThan(0)
    expect(bookDateSort(later, earlier)).toBeGreaterThan(0)
  })

  it('returns 0 for books with the same date', () => {
    const a = makeBook({ available: '2024-06-01' })
    const b = makeBook({ available: '2024-06-01' })
    expect(bookDateSort(a, b)).toBe(0)
  })

  it('prefers preorder date over available date', () => {
    const withPreorder = makeBook({ preorder: '2024-01-01', available: '2025-01-01' })
    const withAvailable = makeBook({ available: '2024-06-01' })
    expect(bookDateSort(withPreorder, withAvailable)).toBeLessThan(0)
  })

  it('falls back to available when preorder is missing', () => {
    const a = makeBook({ available: '2024-01-01' })
    const b = makeBook({ available: '2025-01-01' })
    expect(bookDateSort(a, b)).toBeLessThan(0)
  })

  it('sorts books with no dates after books with dates', () => {
    const withDate = makeBook({ available: '2024-01-01' })
    const noDate = makeBook({})
    expect(bookDateSort(withDate, noDate)).toBeLessThan(0)
    expect(bookDateSort(noDate, withDate)).toBeGreaterThan(0)
  })

  it('returns 0 for two books with no dates', () => {
    const a = makeBook({})
    const b = makeBook({})
    expect(bookDateSort(a, b)).toBeNaN()
  })
})

describe('articleDateSort', () => {
  it('sorts newer articles before older articles (descending)', () => {
    const newer = makeArticle('2025-06-01')
    const older = makeArticle('2024-01-01')
    expect(articleDateSort(newer, older)).toBeLessThan(0)
    expect(articleDateSort(older, newer)).toBeGreaterThan(0)
  })

  it('returns 0 for articles with the same date', () => {
    const a = makeArticle('2024-06-01')
    const b = makeArticle('2024-06-01')
    expect(articleDateSort(a, b)).toBe(0)
  })
})

describe('articleDateString', () => {
  const locale = new Intl.DateTimeFormat().resolvedOptions().locale

  it('formats a date using the browser locale', () => {
    const article = makeArticle('2026-01-15')
    const expected = article.date.toLocaleDateString(locale, {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
    expect(articleDateString(article, locale)).toBe(expected)
  })

  it('respects a different locale', () => {
    const article = makeArticle('2026-03-01')
    const expected = article.date.toLocaleDateString('fr-FR', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
    expect(articleDateString(article, 'fr-FR')).toBe(expected)
  })
})

describe('featuredBookFilter', () => {
  const today = parseDate('2025-06-01')!
  const filter = featuredBookFilter(today)

  it('returns true when featuredUntil is in the future', () => {
    const book = makeBook({ available: '2024-01-01' })
    book.featuredUntil = parseDate('2025-12-31')
    expect(filter(book)).toBe(true)
  })

  it('returns false when featuredUntil is in the past', () => {
    const book = makeBook({ available: '2024-01-01' })
    book.featuredUntil = parseDate('2025-01-01')
    expect(filter(book)).toBe(false)
  })

  it('returns true when featuredUntil is today', () => {
    const book = makeBook({ available: '2024-01-01' })
    book.featuredUntil = parseDate('2025-06-01')
    expect(filter(book)).toBe(true)
  })

  it('returns false when featuredUntil is undefined', () => {
    const book = makeBook({ available: '2024-01-01' })
    expect(filter(book)).toBe(false)
  })
})
