import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import { useHead } from '@unhead/vue'

import { AUTHOR_NAME } from '@/constants'
import { pageUrl } from '@/routes'

interface PageHead {
  /** Page title, shown before the author's name; the name alone when absent */
  title?: string
  description: string
  /** Root-relative image path for link previews, e.g. `/images/x.jpg`; the latest book's cover
   *  (App.vue) when absent */
  image?: string
}

// DEV NOTE: The canonical URL, `og:url` and the other locales' links depend on the locale, so App.vue
//           sets them for every page

/** Title, description and link preview tags for the current page. Returns the full title. */
export function usePageHead(head: MaybeRefOrGetter<PageHead>) {
  const page = computed(() => toValue(head))
  const title = computed(() =>
    page.value.title ? `${page.value.title} — ${AUTHOR_NAME}` : AUTHOR_NAME,
  )

  useHead({
    title,
    meta: computed(() => [
      { name: 'description', content: page.value.description },
      { property: 'og:title', content: title.value },
      { property: 'og:description', content: page.value.description },
      ...(page.value.image ? [{ property: 'og:image', content: pageUrl(page.value.image) }] : []),
    ]),
  })

  return title
}
