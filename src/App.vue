<script setup lang="ts">
import { computed, nextTick, onMounted, provide, readonly, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useHead } from '@unhead/vue'
import Nav from '@/components/Nav.vue'
import { AUTHOR_NAME } from '@/constants'
import { useBooks } from '@/content'
import {
  DEFAULT_LOCALE,
  isCrawler,
  LOCALE_KEY,
  LOCALE_TAGS,
  LOCALES,
  type Locale,
  preferredLocale,
  saveLocale,
  SELECT_LOCALE_KEY,
} from '@/locale'
import { MESSAGES } from '@/messages'
import { indexedPath, pagePath, pageUrl } from '@/routes'
import { bookDateSort } from '@/presentation.ts'
import { pageEntering } from '@/transition'

const route = useRoute()
const router = useRouter()

// DEV NOTE: Pages are pre-built in their route's locale (English at the plain paths), so hydrate in
//           that locale, then switch to the visitor's. index.html hides the page until then.
const locale = ref<Locale>(route.meta.locale ?? DEFAULT_LOCALE)
provide(LOCALE_KEY, readonly(locale))
provide(SELECT_LOCALE_KEY, (l: Locale) => {
  locale.value = l
  saveLocale(l)
})

// Visitors arriving on a search engine copy (/fr/books) read it at the plain path (/books) instead,
// in their own locale, so the address they share works for anyone
async function leaveSearchCopy() {
  const { meta, query, hash } = route
  if (meta.locale && meta.page) await router.replace({ path: pagePath(meta.page), query, hash })
}

// No fade while the pre-built page switches to the visitor's locale, only between pages after that
const pageTransition = ref('none')

onMounted(async () => {
  if (!isCrawler()) {
    locale.value = preferredLocale()
    await leaveSearchCopy()
  }
  await nextTick()
  document.documentElement.classList.remove('locale-pending')
  pageTransition.value = 'page'
})

const canonicalUrl = computed(() =>
  pageUrl(route.meta.page ? indexedPath(route.meta.page, locale.value) : route.path),
)
const books = useBooks().sort(bookDateSort)
const latestBook = books[0]

// The same page in every locale, for search engines; `x-default` is the plain path, which shows
// visitors their preferred locale
const alternates = computed(() => {
  const { page } = route.meta
  if (!page) return []
  return [
    ...LOCALES.map((l) => ({
      rel: 'alternate' as const,
      hreflang: LOCALE_TAGS[l],
      href: pageUrl(indexedPath(page, l)),
    })),
    {
      rel: 'alternate' as const,
      hreflang: 'x-default',
      href: pageUrl(pagePath(page)),
    },
  ]
})

// Site-wide tags; each page sets its own title and description (usePageHead in src/head.ts)
useHead({
  htmlAttrs: { lang: computed(() => LOCALE_TAGS[locale.value]) },
  meta: [
    { name: 'robots', content: 'index, follow' },
    { property: 'og:site_name', content: AUTHOR_NAME },
    { property: 'og:type', content: 'website' },
    { property: 'og:locale', content: computed(() => LOCALE_TAGS[locale.value].replace('-', '_')) },
    {
      property: 'og:image',
      content: pageUrl(latestBook?.imageSrc ?? '/images/no-place-like-home.jpg'),
    },
    { property: 'og:url', content: canonicalUrl },
    { property: 'og:logo', content: pageUrl('/favicon.ico') },
    { name: 'twitter:card', content: 'summary' },
  ],
  link: computed(() => [
    { rel: 'canonical', href: canonicalUrl.value },
    ...alternates.value,
    {
      rel: 'preload',
      href: '/fonts/timesnewhuman/TimesNewHuman-Reg.woff2',
      as: 'font',
      type: 'font/woff2',
      crossorigin: '',
    },
    {
      rel: 'preload',
      href: '/fonts/timesnewhuman/TimesNewHuman-Bol.woff2',
      as: 'font',
      type: 'font/woff2',
      crossorigin: '',
    },
    {
      rel: 'preload',
      href: '/fonts/areal/Areal.woff2',
      as: 'font',
      type: 'font/woff2',
      crossorigin: '',
    },
  ]),
})
</script>

<template>
  <Nav :title="AUTHOR_NAME" :subtitle="MESSAGES[locale].author">
    <!-- DEV NOTE: Pages read the locale once in setup, and /en/x and /fr/x share a component, so key
                   by locale to remount the page when the language changes. Also by path, so that
                   the page fades between pages, but not for a #hash on the same page. -->
    <router-view v-slot="{ Component, route: shown }">
      <Transition
        :name="pageTransition"
        :duration="{ enter: 250, leave: 150 }"
        mode="out-in"
        @before-enter="pageEntering"
      >
        <component :is="Component" :key="`${locale}:${shown.path}`" />
      </Transition>
    </router-view>
  </Nav>
</template>

<style scoped>
/* Between pages, the old one fades out quickly and the new one fades in. The page header's band
   matches the toolbar and stays put, so only its text fades: fading the band would flash the page
   background between two pages that both have one. The fade is on the page's children, not the
   page, so the Transition's `duration` says how long it takes. */
@media (prefers-reduced-motion: no-preference) {
  .page-leave-active > :deep(:not(.page-header)),
  .page-leave-active > :deep(.page-header > *) {
    transition: opacity 0.15s ease-in;
  }

  .page-enter-active > :deep(:not(.page-header)),
  .page-enter-active > :deep(.page-header > *) {
    transition: opacity 0.25s ease-out;
  }

  .page-enter-from > :deep(:not(.page-header)),
  .page-enter-from > :deep(.page-header > *),
  .page-leave-to > :deep(:not(.page-header)),
  .page-leave-to > :deep(.page-header > *) {
    opacity: 0;
  }
}
</style>
