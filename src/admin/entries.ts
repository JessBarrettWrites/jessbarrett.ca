import { toBook, toJournalismPage, toMediaPage, toTalk, withoutEmpty } from '@/content'
import type {
  AboutPage,
  AboutPageToml,
  Book,
  BookToml,
  JournalismPage,
  JournalismToml,
  MediaPage,
  MediaToml,
  Talk,
  TalksPage,
  TalksPageToml,
  TalkToml,
} from '@/types'

// Convert CMS entry data (the fields from `public/admin/config.yml`) into the site's models, using
// the same transforms as the content files. Markdown entries hold their body as a `body` field.
// Optional fields that were cleared in the editor are empty strings, which count as missing.

type EntryData = Record<string, any>

/** Resolve an image path to a displayable URL, e.g. a blob URL for an upload that isn't saved yet */
export type AssetUrl = (path: string) => string

export function bookFromEntry(data: EntryData, slug: string, assetUrl: AssetUrl): Book {
  const { body = '', ...toml } = withoutEmpty(data)
  const book = toBook(slug, toml as BookToml, body)
  return book.imageSrc ? { ...book, imageSrc: assetUrl(book.imageSrc) } : book
}

export function talkFromEntry(data: EntryData, slug: string): Talk {
  const { body = '', ...toml } = withoutEmpty(data)
  return toTalk(slug, toml as TalkToml, body)
}

export function talksPageFromEntry(data: EntryData): TalksPage {
  return withoutEmpty(data) as TalksPageToml
}

export function journalismPageFromEntry(data: EntryData): JournalismPage {
  const toml = withoutEmpty(data) as JournalismToml
  return toJournalismPage({ ...toml, article: (toml.article ?? []).map(withoutEmpty) })
}

export function mediaPageFromEntry(data: EntryData): MediaPage {
  const toml = withoutEmpty(data) as MediaToml
  return toMediaPage({ ...toml, appearance: (toml.appearance ?? []).map(withoutEmpty) })
}

export function aboutPageFromEntry(data: EntryData, assetUrl: AssetUrl): AboutPage {
  const { body = '', ...toml } = withoutEmpty(data)
  const about = toml as AboutPageToml
  return { ...about, imageSrc: about.imageSrc && assetUrl(about.imageSrc), body }
}
