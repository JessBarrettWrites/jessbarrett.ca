import { parse } from 'smol-toml'

import { frontMatter } from '@/frontmatter'
import type {
  BookMeta,
  BookMetaToml,
  Book,
  Testimonial,
  JournalismArticle,
  JournalismToml,
  AboutMeta,
  About,
  TalksPageMeta,
  TalksPage,
  TalkMeta,
  Talk,
} from '@/types'
import { parseDate } from '@/util'

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

function parseTyped<T>(input: string): T {
  return parse(input) as unknown as T
}

function parseBookMeta(toml: BookMetaToml): BookMeta {
  return {
    ...toml,
    featuredUntil: parseDate(toml.featuredUntil),
    preorder: parseDate(toml.preorder),
    available: parseDate(toml.available),
    accolades: toml.accolade ?? [],
  }
}

function getSlug(path: string) {
  return path.split('/').pop()!.replace(/\.md$/, '')
}

export function parseBooks(): Book[] {
  return Object.entries(rawBookFiles).map(([path, raw]) => {
    const slug = getSlug(path)
    const { frontmatter, body } = frontMatter<BookMetaToml>(raw)
    return {
      slug,
      meta: parseBookMeta(frontmatter),
      testimonials: frontmatter.testimonial ?? [],
      body,
    }
  })
}

export function parseTestimonials(): Testimonial[] {
  return parseBooks().flatMap(({ slug, testimonials }) =>
    testimonials.map((t) => ({ ...t, book: slug })),
  )
}

export function parseJournalismArticles(): JournalismArticle[] {
  const { article } = parseTyped<JournalismToml>(rawJournalism)
  return article.map((a) => ({ ...a, date: parseDate(a.date)! }))
}

export function parseTalks(): Talk[] {
  return Object.entries(rawTalkFiles).map(([path, raw]) => {
    const slug = getSlug(path)
    const { frontmatter, body } = frontMatter<TalkMeta>(raw)
    return { slug, meta: frontmatter, body }
  })
}

export function parseTalksPage(): TalksPage {
  const { frontmatter: meta, body } = frontMatter<TalksPageMeta>(rawTalksPage)
  return { meta, body }
}

export function parseAbout(): About {
  const { frontmatter: meta, body } = frontMatter<AboutMeta>(rawAbout)
  return { meta, body }
}
