import { describe, it, expect } from 'vitest'
import {
  mergeLocalized,
  useBooks,
  useTestimonials,
  useJournalismArticles,
  useJournalismPage,
  useMediaAppearances,
  useMediaPage,
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

describe('useJournalismPage', () => {
  it('has a description', () => {
    expect(useJournalismPage().description).toBe('Selected reporting and essays')
  })

  it('has the same articles as useJournalismArticles', () => {
    expect(useJournalismPage().articles).toEqual(useJournalismArticles())
  })
})

describe('useMediaPage', () => {
  it('has a description', () => {
    expect(useMediaPage().description).toBe('Podcasts, interviews and other appearances')
  })

  it('each appearance has required fields', () => {
    expect(useMediaAppearances().length).toBeGreaterThan(0)
    for (const appearance of useMediaAppearances()) {
      expect(appearance.title).toBeTruthy()
      expect(appearance.outlet).toBeTruthy()
      expect(appearance.date).toBeInstanceOf(Date)
      expect(appearance.url).toBeTruthy()
    }
  })

  it('shares the appearances with translations', () => {
    expect(useMediaPage('fr').description).toBe('Balados, entrevues et autres apparitions')
    expect(useMediaPage('fr').appearances).toEqual(useMediaPage('en').appearances)
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

  it('returns a description', () => {
    expect(useTalksPage().description).toBeTruthy()
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

describe('localized content', () => {
  it('uses translated fields where they exist', () => {
    expect(useTalksPage('fr').title).toBe('Conférences')
    expect(useJournalismPage('fr').description).toBe('Reportages et essais choisis')
    expect(useAboutPage('fr').body).toContain('journaliste primée')
    expect(useTalks('fr').map((t) => t.title)).toContain('Le pouvoir caché du bon voisinage')
    expect(useBooks('fr')[0]!.body).toContain('chez-soi')
    expect(useTalksPage('es').title).toBe('Conferencias')
    expect(useTalks('es').map((t) => t.title)).toContain('El poder oculto de la buena vecindad')
    expect(useBooks('es')[0]!.body).toContain('hogar')
  })

  it('falls back to the default locale for untranslated fields and entries', () => {
    expect(useAboutPage('fr').title).toBe(useAboutPage('en').title)
    expect(useAboutPage('fr').imageSrc).toBe(useAboutPage('en').imageSrc)
    expect(useBooks('fr').map((b) => b.slug)).toEqual(useBooks('en').map((b) => b.slug))
    expect(useTalks('fr').map((t) => t.slug)).toEqual(useTalks('en').map((t) => t.slug))
    // The published (English) title, cover, dates and lists are shared
    const [frBook, enBook] = [useBooks('fr')[0]!, useBooks('en')[0]!]
    expect(frBook.title).toBe(enBook.title)
    expect(frBook.imageSrc).toBe(enBook.imageSrc)
    expect(frBook.available).toEqual(enBook.available)
    // Testimonials keep their quotes and names, with translated roles
    const pick = (book: typeof enBook) =>
      book.testimonials.map(({ quote, name }) => ({ quote, name }))
    expect(pick(frBook)).toEqual(pick(enBook))
    expect(frBook.testimonials[0]!.role).toBe('Économiste et autrice de In This Economy?')
    expect(useBooks('es')[0]!.testimonials[0]!.role).toBe('Economista y autora de In This Economy?')
    expect(useJournalismPage('fr').articles).toEqual(useJournalismPage('en').articles)
  })
})

describe('mergeLocalized', () => {
  it("merges translated list items by position, keeping the default list's items", () => {
    const base = {
      list: [
        { quote: 'Q1', role: 'R1' },
        { quote: 'Q2', role: 'R2' },
      ],
    }
    expect(mergeLocalized(base, { list: [{ role: 'Rôle 1' }] })).toEqual({
      list: [
        { quote: 'Q1', role: 'Rôle 1' },
        { quote: 'Q2', role: 'R2' },
      ],
    })
    expect(
      mergeLocalized(base, { list: [{ role: '' }, { role: 'Rôle 2' }, { role: 'extra' }] }),
    ).toEqual({
      list: [
        { quote: 'Q1', role: 'R1' },
        { quote: 'Q2', role: 'Rôle 2' },
      ],
    })
  })

  it('lets translations override fields, ignoring empty ones', () => {
    expect(mergeLocalized({ a: 'A', b: 'B', c: '' }, { a: 'Á', b: '' })).toEqual({ a: 'Á', b: 'B' })
  })
})
