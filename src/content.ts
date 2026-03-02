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
} from '@/types'
import { parseDate } from '@/util'

import rawJournalism from '../content/journalism.toml?raw'
import rawAbout from '../content/about.md?raw'

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
  }
}

function bookSortKey(entry: Book): number {
  const d = entry.meta.preorder ?? entry.meta.available
  return d ? d.getTime() : Infinity
}

export function parseBooks(): Book[] {
  return Object.entries(rawBookFiles)
    .map(([path, raw]) => {
      const slug = path.split('/').pop()!.replace(/\.md$/, '')
      const { frontmatter, body } = frontMatter<BookMetaToml>(raw)
      return {
        slug,
        meta: parseBookMeta(frontmatter),
        testimonials: frontmatter.testimonial ?? [],
        body,
      }
    })
    .sort((a, b) => bookSortKey(a) - bookSortKey(b))
}

export function parseTestimonials(): Testimonial[] {
  return parseBooks().flatMap(({ slug, testimonials }) =>
    testimonials.map((t) => ({ ...t, book: slug })),
  )
}

export function parseJournalism(): JournalismArticle[] {
  const { article } = parseTyped<JournalismToml>(rawJournalism)
  return article
}

export function parseAbout(): About {
  const { frontmatter: meta, body } = frontMatter<AboutMeta>(rawAbout)
  return { meta, body }
}
