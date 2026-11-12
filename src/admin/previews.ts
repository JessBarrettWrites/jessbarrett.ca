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

const data = ({ entry }: PreviewTemplateProps) => entry.get('data')?.toJS() ?? {}
const slug = ({ entry }: PreviewTemplateProps) => entry.get('slug') || 'preview'
const assetUrl =
  ({ getAsset }: PreviewTemplateProps) =>
  (path: string) =>
    getAsset(path)?.toString() || path

// Names match `public/admin/config.yml`: collection names for folders, file names for single files
CMS.registerPreviewTemplate(
  'books-list',
  vuePreview(BookPreview, (props) => ({
    book: bookFromEntry(data(props), slug(props), assetUrl(props)),
  })),
)

CMS.registerPreviewTemplate(
  'talks-detail',
  vuePreview(TalkPreview, (props) => ({ talk: talkFromEntry(data(props), slug(props)) })),
)

CMS.registerPreviewTemplate(
  'talks-list',
  vuePreview(TalksContent, async (props) => {
    const entries = (await props.getCollection('talks-detail')) as ImmutableMap[]
    const talks = entries
      .map((entry) => talkFromEntry(entry.get('data').toJS(), entry.get('slug')))
      // Same order as the site, which loads talks by filename
      .sort((left, right) => left.slug.localeCompare(right.slug))
    return { page: talksPageFromEntry(data(props)), talks }
  }),
)

CMS.registerPreviewTemplate(
  'journalism-detail',
  vuePreview(JournalismContent, (props) => ({ page: journalismPageFromEntry(data(props)) })),
)

CMS.registerPreviewTemplate(
  'about',
  vuePreview(AboutContent, (props) => ({
    about: aboutPageFromEntry(data(props), assetUrl(props)),
  })),
)
