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
import { DEFAULT_LOCALE, type Locale } from '@/locale'
import { getSlug, parseDate, parseFront, parseTyped } from '@/parse.ts'

import rawContact from '../content/contact.toml?raw'

// DEV NOTE: Content is stored per locale (`content/<locale>/...`). A translation only needs the
//           fields it translates: everything else (and any entry that isn't translated yet) comes
//           from the default locale. See `mergeLocalized`.

const rawAboutFiles = import.meta.glob<string>('../content/*/about.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})
const rawTalksPageFiles = import.meta.glob<string>('../content/*/talks.toml', {
  query: '?raw',
  import: 'default',
  eager: true,
})
const rawJournalismFiles = import.meta.glob<string>('../content/*/journalism.toml', {
  query: '?raw',
  import: 'default',
  eager: true,
})
const rawTalkFiles = import.meta.glob<string>('../content/*/talks/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})
const rawBookFiles = import.meta.glob<string>('../content/*/books/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

type Fields = Record<string, any>
type RawFiles = Record<string, string>

/** Markdown files become their frontmatter fields plus a `body` field */
function readMarkdown(raw: string): Fields {
  const { frontmatter, body } = parseFront<Fields>(raw)
  return { ...frontmatter, body }
}

function readToml(raw: string): Fields {
  return parseTyped<Fields>(raw)
}

/** Drop empty strings, which is how the CMS saves a cleared optional field or an untranslated one */
export function withoutEmpty<T extends Fields>(fields: T): T {
  return Object.fromEntries(Object.entries(fields).filter(([, value]) => value !== '')) as T
}

/** Fields of a translation override the default locale's, except empty ones */
export function mergeLocalized(base: Fields, translation: Fields): Fields {
  const merged: Fields = withoutEmpty(base)
  for (const [key, value] of Object.entries(withoutEmpty(translation))) {
    const baseValue = merged[key]
    merged[key] =
      Array.isArray(value) && Array.isArray(baseValue) ? mergeList(baseValue, value) : value
  }
  return merged
}

const isFields = (value: unknown): value is Fields =>
  typeof value === 'object' && value !== null && !Array.isArray(value) && !(value instanceof Date)

// DEV NOTE: A translated list (e.g. testimonials, where only the `role` is translated) lines up with
//           the default locale's list by position. The default locale decides which items there are,
//           so an item added in English shows (untranslated) until the translation catches up.
function mergeList(base: unknown[], translation: unknown[]): unknown[] {
  return base.map((item, i) => {
    const translated = translation[i]
    return isFields(item) && isFields(translated) ? mergeLocalized(item, translated) : item
  })
}

// '../content/<locale>/...' → '<locale>'
function localeOf(path: string): string | undefined {
  return path.split('/')[2]
}

function localizedFile(files: RawFiles, locale: Locale, read: (raw: string) => Fields): Fields {
  const find = (l: Locale) => Object.entries(files).find(([path]) => localeOf(path) === l)?.[1]
  const base = find(DEFAULT_LOCALE)
  const translation = locale === DEFAULT_LOCALE ? undefined : find(locale)
  return mergeLocalized(base ? read(base) : {}, translation ? read(translation) : {})
}

/** Entries of a folder by slug (sorted, like the files), including ones only in the locale */
function localizedFolder(
  files: RawFiles,
  locale: Locale,
  read: (raw: string) => Fields,
): [string, Fields][] {
  const bySlug = (l: Locale) =>
    new Map(
      Object.entries(files)
        .filter(([path]) => localeOf(path) === l)
        .map(([path, raw]) => [getSlug(path), raw]),
    )
  const base = bySlug(DEFAULT_LOCALE)
  const translations = locale === DEFAULT_LOCALE ? new Map<string, string>() : bySlug(locale)
  const slugs = [...new Set([...base.keys(), ...translations.keys()])].sort()

  return slugs.map((slug) => {
    const baseRaw = base.get(slug)
    const translationRaw = translations.get(slug)
    return [
      slug,
      mergeLocalized(baseRaw ? read(baseRaw) : {}, translationRaw ? read(translationRaw) : {}),
    ]
  })
}

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

export function useBooks(locale: Locale = DEFAULT_LOCALE): Book[] {
  return localizedFolder(rawBookFiles, locale, readMarkdown).map(([slug, fields]) => {
    const { body = '', ...toml } = fields
    return toBook(slug, toml as BookToml, body)
  })
}

export function useContacts(): Contact {
  return parseTyped<Contact>(rawContact)
}

export function useTestimonials(locale: Locale = DEFAULT_LOCALE): Testimonial[] {
  return useBooks(locale).flatMap((book) => {
    return book.testimonials.map((testimonial) => {
      return { ...testimonial, book: book.slug }
    })
  })
}

export function useJournalismPage(locale: Locale = DEFAULT_LOCALE): JournalismPage {
  return toJournalismPage(localizedFile(rawJournalismFiles, locale, readToml) as JournalismToml)
}

export function useJournalismArticles(locale: Locale = DEFAULT_LOCALE): JournalismArticle[] {
  return useJournalismPage(locale).articles
}

export function useTalks(locale: Locale = DEFAULT_LOCALE): Talk[] {
  return localizedFolder(rawTalkFiles, locale, readMarkdown).map(([slug, fields]) => {
    const { body = '', ...toml } = fields
    return toTalk(slug, toml as TalkToml, body)
  })
}

export function useTalksPage(locale: Locale = DEFAULT_LOCALE): TalksPage {
  return localizedFile(rawTalksPageFiles, locale, readToml) as TalksPageToml
}

export function useAboutPage(locale: Locale = DEFAULT_LOCALE): AboutPage {
  const { body = '', ...toml } = localizedFile(rawAboutFiles, locale, readMarkdown)
  return { ...(toml as AboutPageToml), body }
}
