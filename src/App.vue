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

onMounted(async () => {
  if (!isCrawler()) {
    locale.value = preferredLocale()
    await leaveSearchCopy()
  }
  await nextTick()
  document.documentElement.classList.remove('locale-pending')
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

useHead({
  htmlAttrs: { lang: computed(() => LOCALE_TAGS[locale.value]) },
  titleTemplate: (title) => (title === AUTHOR_NAME ? title : `${title} — ${AUTHOR_NAME}`),
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
                   by locale to remount the page when the language changes -->
    <router-view v-slot="{ Component }">
      <component :is="Component" :key="locale" />
    </router-view>
  </Nav>
</template>

<style scoped></style>
