<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import { useHead } from '@unhead/vue'
import Nav from '@/components/Nav.vue'
import { AUTHOR_NAME } from '@/constants'
import { useBooks } from '@/content'
import { pageUrl } from '@/routes'

const route = useRoute()
const canonicalUrl = computed(() => pageUrl(route.path))
const noPlaceLikeHomeBook = useBooks().find((b) => b.slug === 'no-place-like-home')

useHead({
  titleTemplate: (title) => (title === AUTHOR_NAME ? title : `${title} — ${AUTHOR_NAME}`),
  meta: [
    { name: 'robots', content: 'index, follow' },
    { property: 'og:site_name', content: AUTHOR_NAME },
    { property: 'og:type', content: 'website' },
    { property: 'og:locale', content: 'en_CA' },
    {
      property: 'og:image',
      content: pageUrl(noPlaceLikeHomeBook?.imageSrc ?? '/images/no-place-like-home.jpg'),
    },
    { property: 'og:url', content: canonicalUrl },
    { name: 'twitter:card', content: 'summary' },
  ],
  link: [
    { rel: 'canonical', href: canonicalUrl },
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
  ],
})
</script>

<template>
  <Nav :title="AUTHOR_NAME" subtitle="Author">
    <router-view v-slot="{ Component }">
      <component :is="Component" />
    </router-view>
  </Nav>
</template>

<style scoped></style>
