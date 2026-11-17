import { describe, it, expect } from 'vitest'
import {
  aboutPageFromEntry,
  bookFromEntry,
  journalismPageFromEntry,
  mediaPageFromEntry,
  talkFromEntry,
  talksPageFromEntry,
} from '@/admin/entries'

// DEV NOTE: Entry data as the CMS hands it to preview templates: dates are `YYYY-MM-DD` strings, and
//           cleared optional fields are empty strings
const BOOK_ENTRY = {
  featuredUntil: '',
  title: 'Test Book',
  subtitle: '',
  imageSrc: '/images/test.jpg',
  imageAlt: 'Test book cover',
  url: 'https://example.com',
  preorder: '2025-10-01',
  available: '2026-03-03',
  accolade: [{ text: 'An accolade', url: 'https://example.com/accolade' }],
  body: 'A **description**.',
}

const blobUrl = (path: string) => `blob:${path}`

describe('bookFromEntry', () => {
  it('parses dates to local midnight', () => {
    const book = bookFromEntry(BOOK_ENTRY, 'test-book', blobUrl)
    expect(book.available!.getFullYear()).toBe(2026)
    expect(book.available!.getMonth()).toBe(2) // 0-indexed
    expect(book.available!.getDate()).toBe(3)
    expect(book.available!.getHours()).toBe(0)
  })

  it('treats cleared fields as missing', () => {
    const book = bookFromEntry(BOOK_ENTRY, 'test-book', blobUrl)
    expect(book.featuredUntil).toBeUndefined()
    expect(book.subtitle).toBeUndefined()
  })

  it('maps lists and the body like the content files', () => {
    const book = bookFromEntry(BOOK_ENTRY, 'test-book', blobUrl)
    expect(book.slug).toBe('test-book')
    expect(book.accolades).toEqual(BOOK_ENTRY.accolade)
    expect(book.testimonials).toEqual([])
    expect(book.body).toBe('A **description**.')
  })

  it('resolves the cover image through the asset getter', () => {
    expect(bookFromEntry(BOOK_ENTRY, 'test-book', blobUrl).imageSrc).toBe('blob:/images/test.jpg')
  })

  it('leaves a missing cover image missing', () => {
    const { imageSrc: _, ...entry } = BOOK_ENTRY
    expect(bookFromEntry(entry, 'test-book', blobUrl).imageSrc).toBeUndefined()
  })
})

describe('talkFromEntry', () => {
  it('maps the title and body', () => {
    expect(talkFromEntry({ title: 'A Talk', body: 'About it.' }, 'a-talk')).toEqual({
      slug: 'a-talk',
      title: 'A Talk',
      body: 'About it.',
    })
  })
})

describe('talksPageFromEntry', () => {
  it('keeps the description', () => {
    const page = talksPageFromEntry({ title: 'Talks', subtitle: '', description: 'Book Jessica.' })
    expect(page).toEqual({ title: 'Talks', description: 'Book Jessica.' })
  })
})

describe('journalismPageFromEntry', () => {
  it('maps the description and articles', () => {
    const page = journalismPageFromEntry({
      description: 'Selected reporting and essays',
      article: [
        {
          title: 'An Article',
          publication: 'A Paper',
          date: '2026-01-26',
          url: 'https://example.com/article',
          description: '',
        },
      ],
    })
    expect(page.description).toBe('Selected reporting and essays')
    expect(page.articles).toHaveLength(1)
    expect(page.articles[0]!.date.getDate()).toBe(26)
    expect(page.articles[0]!.description).toBeUndefined()
  })

  it('handles an empty article list', () => {
    expect(journalismPageFromEntry({ description: '' }).articles).toEqual([])
  })
})

describe('mediaPageFromEntry', () => {
  it('maps the description and appearances', () => {
    const page = mediaPageFromEntry({
      description: 'Podcasts and interviews',
      appearance: [
        {
          title: 'An Episode',
          outlet: 'A Podcast',
          date: '2026-11-15',
          url: 'https://example.com/episode',
          description: '',
        },
      ],
    })
    expect(page.description).toBe('Podcasts and interviews')
    expect(page.appearances[0]!.outlet).toBe('A Podcast')
    expect(page.appearances[0]!.date).toBeInstanceOf(Date)
    expect(page.appearances[0]!.description).toBeUndefined()
  })

  it('has no appearances when the entry has none', () => {
    expect(mediaPageFromEntry({ description: '' }).appearances).toEqual([])
  })
})

describe('aboutPageFromEntry', () => {
  it('resolves the portrait through the asset getter and keeps the body', () => {
    const about = aboutPageFromEntry(
      { title: 'Jessica Barrett', imageSrc: '/images/me.jpg', imageAlt: 'Me', body: 'Bio.' },
      blobUrl,
    )
    expect(about.imageSrc).toBe('blob:/images/me.jpg')
    expect(about.body).toBe('Bio.')
  })
})
