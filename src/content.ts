import type {
  AboutPage,
  AboutPageToml,
  Book,
  BookToml,
  Contact,
  JournalismArticle,
  JournalismArticleToml,
  JournalismPage,
  JournalismToml,
  Talk,
  TalksPage,
  TalksPageToml,
  TalkToml,
  Testimonial,
} from '@/types'
import { getSlug, parseDate, parseFront, parseTyped } from '@/parse.ts'

import rawContact from '../content/contact.toml?raw'
import rawJournalism from '../content/journalism.toml?raw'
import rawAbout from '../content/about.md?raw'
import rawTalksPage from '../content/talks.toml?raw'

const rawTalkFiles = import.meta.glob<string>('../content/talks/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

const rawBookFiles = import.meta.glob<string>('../content/books/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

// DEV NOTE: The `to*` transforms are shared with the CMS previews (`src/admin`), which get the same
//           fields from the editor instead of from the files on disk

export function toBook(slug: string, toml: BookToml, body: string): Book {
  return {
    ...toml,
    slug,
    featuredUntil: parseDate(toml.featuredUntil),
    preorder: parseDate(toml.preorder),
    available: parseDate(toml.available),
    accolades: toml.accolade ?? [],
    testimonials: toml.testimonial ?? [],
    body,
  }
}

export function toTalk(slug: string, toml: TalkToml, body: string): Talk {
  return { slug, ...toml, body }
}

export function toJournalismArticle(toml: JournalismArticleToml): JournalismArticle {
  return { ...toml, date: parseDate(toml.date)! }
}

export function toJournalismPage(toml: JournalismToml): JournalismPage {
  return {
    description: toml.description,
    articles: (toml.article ?? []).map(toJournalismArticle),
  }
}

export function useBooks(): Book[] {
  return Object.entries(rawBookFiles).map(([path, raw]) => {
    const { frontmatter, body } = parseFront<BookToml>(raw)
    return toBook(getSlug(path), frontmatter, body)
  })
}

export function useContacts(): Contact {
  return parseTyped<Contact>(rawContact)
}

export function useTestimonials(): Testimonial[] {
  return useBooks().flatMap((book) => {
    return book.testimonials.map((testimonial) => {
      return { ...testimonial, book: book.slug }
    })
  })
}

export function useJournalismPage(): JournalismPage {
  return toJournalismPage(parseTyped<JournalismToml>(rawJournalism))
}

export function useJournalismArticles(): JournalismArticle[] {
  return useJournalismPage().articles
}

export function useTalks(): Talk[] {
  return Object.entries(rawTalkFiles).map(([path, raw]) => {
    const { frontmatter, body } = parseFront<TalkToml>(raw)
    return toTalk(getSlug(path), frontmatter, body)
  })
}

export function useTalksPage(): TalksPage {
  return parseTyped<TalksPageToml>(rawTalksPage)
}

export function useAboutPage(): AboutPage {
  const { frontmatter, body } = parseFront<AboutPageToml>(rawAbout)
  return { ...frontmatter, body }
}
