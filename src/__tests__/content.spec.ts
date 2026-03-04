import { describe, it, expect } from 'vitest'
import {
  useBooks,
  useTestimonials,
  useJournalismArticles,
  useTalks,
  useTalksPage,
  useAboutPage,
} from '@/content'

// DEV NOTE: Extracted from content to have a reasonable test
const TEST_BOOK = {
  slug: 'no-place-like-home',
  title: 'No Place Like Home',
}

describe('useBooks', () => {
  it('returns a non-empty array', () => {
    const books = useBooks()
    expect(books.length).toBeGreaterThan(0)
  })

  it('each book has required fields', () => {
    for (const book of useBooks()) {
      expect(book.slug).toBeTruthy()
      expect(book.title).toBeTruthy()
      expect(book.imageSrc).toBeTruthy()
      expect(book.imageAlt).toBeTruthy()
      expect(book.url).toBeTruthy()
    }
  })

  it('includes the expected TEST_BOOK', () => {
    const books = useBooks()
    const found = books.find((b) => b.slug === TEST_BOOK.slug)
    expect(found).toBeDefined()
    expect(found!.title).toBe(TEST_BOOK.title)
  })

  it('converts date strings to Date objects', () => {
    const books = useBooks()
    const book = books.find((b) => b.slug === TEST_BOOK.slug)!
    if (book.available) expect(book.available).toBeInstanceOf(Date)
    if (book.preorder) expect(book.preorder).toBeInstanceOf(Date)
    if (book.featuredUntil) expect(book.featuredUntil).toBeInstanceOf(Date)
  })

  it('maps accolade TOML array to accolades field', () => {
    const book = useBooks().find((b) => b.slug === TEST_BOOK.slug)!
    expect(Array.isArray(book.accolades)).toBe(true)
    expect(book.accolades!.length).toBeGreaterThan(0)
    expect(book.accolades![0]).toHaveProperty('text')
    expect(book.accolades![0]).toHaveProperty('url')
  })
})

describe('useTestimonials', () => {
  it('returns a non-empty array', () => {
    expect(useTestimonials().length).toBeGreaterThan(0)
  })

  it('each testimonial has quote, name, and book slug', () => {
    for (const t of useTestimonials()) {
      expect(t.quote).toBeTruthy()
      expect(t.name).toBeTruthy()
      expect(t.book).toBeTruthy()
    }
  })

  it('testimonial book slug matches a real book slug', () => {
    const slugs = new Set(useBooks().map((b) => b.slug))
    for (const t of useTestimonials()) {
      expect(slugs.has(t.book)).toBe(true)
    }
  })
})

describe('parseJournalism', () => {
  it('returns a non-empty array', () => {
    expect(useJournalismArticles().length).toBeGreaterThan(0)
  })

  it('each article has required fields', () => {
    for (const article of useJournalismArticles()) {
      expect(article.title).toBeTruthy()
      expect(article.publication).toBeTruthy()
      expect(article.date).toBeInstanceOf(Date)
      expect(article.url).toBeTruthy()
    }
  })
})

describe('useTalks', () => {
  it('returns a non-empty array', () => {
    expect(useTalks().length).toBeGreaterThan(0)
  })

  it('each talk has a slug and title', () => {
    for (const talk of useTalks()) {
      expect(talk.slug).toBeTruthy()
      expect(talk.title).toBeTruthy()
    }
  })
})

describe('useTalksPage', () => {
  it('returns a title', () => {
    const page = useTalksPage()
    expect(page.title).toBeTruthy()
  })
})

describe('useAbout', () => {
  it('returns the expected author name as title', () => {
    const about = useAboutPage()
    expect(about.title).toBe('Jessica Barrett')
  })

  it('has imageSrc and imageAlt', () => {
    const about = useAboutPage()
    expect(about.imageSrc).toBeTruthy()
    expect(about.imageAlt).toBeTruthy()
  })

  it('has a non-empty body', () => {
    const about = useAboutPage()
    expect(about.body.length).toBeGreaterThan(0)
  })
})
