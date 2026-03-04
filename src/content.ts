import type {
  AboutPage,
  AboutPageToml,
  Book,
  BookToml,
  JournalismArticle,
  JournalismToml,
  Talk,
  TalksPage,
  TalksPageToml,
  TalkToml,
  Testimonial,
} from '@/types'
import { getSlug, parseDate, parseFront, parseTyped } from '@/parse.ts'

import rawJournalism from '../content/journalism.toml?raw'
import rawAbout from '../content/about.md?raw'
import rawTalksPage from '../content/talks.md?raw'

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

export function useBooks(): Book[] {
  return Object.entries(rawBookFiles).map(([path, raw]) => {
    const slug = getSlug(path)
    const { frontmatter: toml, body } = parseFront<BookToml>(raw)
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
  })
}

export function useTestimonials(): Testimonial[] {
  return useBooks().flatMap((book) => {
    return book.testimonials.map((testimonial) => {
      return { ...testimonial, book: book.slug }
    })
  })
}

export function useJournalismArticles(): JournalismArticle[] {
  const { article: articles } = parseTyped<JournalismToml>(rawJournalism)
  return articles.map((article) => {
    return { ...article, date: parseDate(article.date)! }
  })
}

export function useTalks(): Talk[] {
  return Object.entries(rawTalkFiles).map(([path, raw]) => {
    const slug = getSlug(path)
    const { frontmatter, body } = parseFront<TalkToml>(raw)
    return { slug, ...frontmatter, body }
  })
}

export function useTalksPage(): TalksPage {
  const { frontmatter, body } = parseFront<TalksPageToml>(rawTalksPage)
  return { ...frontmatter, body }
}

export function useAboutPage(): AboutPage {
  const { frontmatter, body } = parseFront<AboutPageToml>(rawAbout)
  return { ...frontmatter, body }
}
