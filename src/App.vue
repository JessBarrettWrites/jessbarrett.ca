<script setup lang="ts">
import { computed, provide, watchEffect } from 'vue'
import { useRoute } from 'vue-router'

import { useHead } from '@unhead/vue'
import Nav from '@/components/Nav.vue'
import { AUTHOR_NAME } from '@/constants'
import { useBooks } from '@/content'
import {
  DEFAULT_LOCALE,
  LOCALE_KEY,
  LOCALE_STORAGE_KEY,
  LOCALE_TAGS,
  LOCALES,
  type Locale,
} from '@/locale'
import { MESSAGES } from '@/messages'
import { pagePath, pageUrl } from '@/routes'
import { bookDateSort } from '@/presentation.ts'

const route = useRoute()
const locale = computed<Locale>(() => route.meta.locale ?? DEFAULT_LOCALE)
provide(LOCALE_KEY, locale)

// Remember the locale being read, so unprefixed links (/books) go back to it
watchEffect(() => {
  if (typeof window === 'undefined' || !route.meta.locale) return
  try {
    localStorage.setItem(LOCALE_STORAGE_KEY, route.meta.locale)
  } catch {
    // Storage may be unavailable; the browser language is used instead
  }
})

const canonicalUrl = computed(() => pageUrl(route.path))
const books = useBooks().sort(bookDateSort)
const latestBook = books[0]

// The same page in every locale, for search engines; `x-default` is the language chooser
const alternates = computed(() => {
  const { page } = route.meta
  if (!page || !route.meta.locale) return []
  return [
    ...LOCALES.map((l) => ({
      rel: 'alternate' as const,
      hreflang: LOCALE_TAGS[l],
      href: pageUrl(pagePath(page, l)),
    })),
    {
      rel: 'alternate' as const,
      hreflang: 'x-default',
      href: pageUrl(pagePath(page, DEFAULT_LOCALE)),
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
    <router-view v-slot="{ Component }">
      <component :is="Component" />
    </router-view>
  </Nav>
</template>

<style scoped></style>
