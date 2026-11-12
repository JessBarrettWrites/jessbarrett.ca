// Entry point for the CMS preview bundle (`pnpm build-admin`), loaded by `public/admin/index.html`
// after the Sveltia CMS script. The site's CSS is emitted as `previews.css` next to this script and
// only applied inside the preview iframe, so it never restyles the CMS itself.
import '@/fonts.css'
import '@/main.css'

import AboutContent from '@/components/AboutContent.vue'
import JournalismContent from '@/components/JournalismContent.vue'
import TalksContent from '@/components/TalksContent.vue'
import BookPreview from '@/admin/previews/BookPreview.vue'
import TalkPreview from '@/admin/previews/TalkPreview.vue'
import { vuePreview } from '@/admin/bridge'
import { mergeLocalized } from '@/content'
import { DEFAULT_LOCALE, type Locale } from '@/locale'
import {
  aboutPageFromEntry,
  bookFromEntry,
  journalismPageFromEntry,
  talkFromEntry,
  talksPageFromEntry,
} from '@/admin/entries'
import type { ImmutableMap, PreviewTemplateProps } from '@/admin/sveltia'

const { CMS } = window

CMS.registerPreviewStyle(new URL('./previews.css', import.meta.url).href)

const fieldsOf = (map: ImmutableMap | undefined): Record<string, any> => map?.toJS() ?? {}

// The entry being edited holds the previewed locale's fields in `data` and the other locales' in
// `i18n`. Like the site, a translation shows the default locale's fields where it has none.
function data({ entry }: PreviewTemplateProps, locale: Locale) {
  const own = fieldsOf(entry.get('data'))
  if (locale === DEFAULT_LOCALE) return mergeLocalized({}, own)
  const base = fieldsOf(entry.get('i18n')?.get(DEFAULT_LOCALE)?.get('data'))
  return mergeLocalized(base, own)
}

// Entries from `getCollection()` hold the default locale's fields in `data` instead
function collectionData(entry: ImmutableMap, locale: Locale) {
  const base = fieldsOf(entry.get('data'))
  if (locale === DEFAULT_LOCALE) return mergeLocalized(base, {})
  return mergeLocalized(base, fieldsOf(entry.get('i18n')?.get(locale)?.get('data')))
}

const slug = ({ entry }: PreviewTemplateProps) => entry.get('slug') || 'preview'
const assetUrl =
  ({ getAsset }: PreviewTemplateProps) =>
  (path: string) =>
    getAsset(path)?.toString() || path

// Names match `public/admin/config.yml`: collection names for folders, file names for single files
CMS.registerPreviewTemplate(
  'books-list',
  vuePreview(BookPreview, (props, locale) => ({
    book: bookFromEntry(data(props, locale), slug(props), assetUrl(props)),
  })),
)

CMS.registerPreviewTemplate(
  'talks-detail',
  vuePreview(TalkPreview, (props, locale) => ({
    talk: talkFromEntry(data(props, locale), slug(props)),
  })),
)

CMS.registerPreviewTemplate(
  'talks-list',
  vuePreview(TalksContent, async (props, locale) => {
    const entries = (await props.getCollection('talks-detail')) as ImmutableMap[]
    const talks = entries
      .map((entry) => talkFromEntry(collectionData(entry, locale), entry.get('slug')))
      // Same order as the site, which loads talks by filename
      .sort((left, right) => left.slug.localeCompare(right.slug))
    return { page: talksPageFromEntry(data(props, locale)), talks }
  }),
)

CMS.registerPreviewTemplate(
  'journalism-detail',
  vuePreview(JournalismContent, (props, locale) => ({
    page: journalismPageFromEntry(data(props, locale)),
  })),
)

CMS.registerPreviewTemplate(
  'about',
  vuePreview(AboutContent, (props, locale) => ({
    about: aboutPageFromEntry(data(props, locale), assetUrl(props)),
  })),
)
