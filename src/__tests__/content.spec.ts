import { describe, it, expect } from 'vitest'
import {
  parseBooks,
  parseTestimonials,
  parseJournalism,
  parseTalks,
  parseTalksPage,
  parseAbout,
} from '@/content'

// DEV NOTE: Extracted from content to have a reasonable test
const TEST_BOOK = {
  slug: 'no-place-like-home',
  title: 'No Place Like Home',
}

describe('parseBooks', () => {
  it('returns a non-empty array', () => {
    const books = parseBooks()
    expect(books.length).toBeGreaterThan(0)
  })

  it('each book has required fields', () => {
    for (const book of parseBooks()) {
      expect(book.slug).toBeTruthy()
      expect(book.meta.title).toBeTruthy()
      expect(book.meta.imageSrc).toBeTruthy()
      expect(book.meta.imageAlt).toBeTruthy()
      expect(book.meta.url).toBeTruthy()
    }
  })

  it('includes the expected TEST_BOOK', () => {
    const books = parseBooks()
    const found = books.find((b) => b.slug === TEST_BOOK.slug)
    expect(found).toBeDefined()
    expect(found!.meta.title).toBe(TEST_BOOK.title)
  })

  it('converts date strings to Date objects', () => {
    const books = parseBooks()
    const book = books.find((b) => b.slug === TEST_BOOK.slug)!
    if (book.meta.available) expect(book.meta.available).toBeInstanceOf(Date)
    if (book.meta.preorder) expect(book.meta.preorder).toBeInstanceOf(Date)
    if (book.meta.featuredUntil) expect(book.meta.featuredUntil).toBeInstanceOf(Date)
  })

  it('maps accolade TOML array to accolades field', () => {
    const book = parseBooks().find((b) => b.slug === TEST_BOOK.slug)!
    expect(Array.isArray(book.meta.accolades)).toBe(true)
    expect(book.meta.accolades!.length).toBeGreaterThan(0)
    expect(book.meta.accolades![0]).toHaveProperty('text')
    expect(book.meta.accolades![0]).toHaveProperty('url')
  })

  it('books with no dates sort after books with dates', () => {
    const books = parseBooks()
    // All books with dates should appear before books without
    const withDates = books.filter((b) => b.meta.preorder || b.meta.available)
    const withoutDates = books.filter((b) => !b.meta.preorder && !b.meta.available)
    expect(books.slice(0, withDates.length)).toEqual(withDates)
    expect(books.slice(withDates.length)).toEqual(withoutDates)
  })
})

describe('parseTestimonials', () => {
  it('returns a non-empty array', () => {
    expect(parseTestimonials().length).toBeGreaterThan(0)
  })

  it('each testimonial has quote, name, and book slug', () => {
    for (const t of parseTestimonials()) {
      expect(t.quote).toBeTruthy()
      expect(t.name).toBeTruthy()
      expect(t.book).toBeTruthy()
    }
  })

  it('testimonial book slug matches a real book slug', () => {
    const slugs = new Set(parseBooks().map((b) => b.slug))
    for (const t of parseTestimonials()) {
      expect(slugs.has(t.book)).toBe(true)
    }
  })
})

describe('parseJournalism', () => {
  it('returns a non-empty array', () => {
    expect(parseJournalism().length).toBeGreaterThan(0)
  })

  it('each article has required fields', () => {
    for (const article of parseJournalism()) {
      expect(article.title).toBeTruthy()
      expect(article.publication).toBeTruthy()
      expect(article.date).toBeTruthy()
      expect(article.url).toBeTruthy()
    }
  })
})

describe('parseTalks', () => {
  it('returns a non-empty array', () => {
    expect(parseTalks().length).toBeGreaterThan(0)
  })

  it('each talk has a slug and title', () => {
    for (const talk of parseTalks()) {
      expect(talk.slug).toBeTruthy()
      expect(talk.meta.title).toBeTruthy()
    }
  })
})

describe('parseTalksPage', () => {
  it('returns a title', () => {
    const page = parseTalksPage()
    expect(page.meta.title).toBeTruthy()
  })
})

describe('parseAbout', () => {
  it('returns the expected author name as title', () => {
    const about = parseAbout()
    expect(about.meta.title).toBe('Jessica Barrett')
  })

  it('has imageSrc and imageAlt', () => {
    const about = parseAbout()
    expect(about.meta.imageSrc).toBeTruthy()
    expect(about.meta.imageAlt).toBeTruthy()
  })

  it('has a non-empty body', () => {
    const about = parseAbout()
    expect(about.body.length).toBeGreaterThan(0)
  })
})
