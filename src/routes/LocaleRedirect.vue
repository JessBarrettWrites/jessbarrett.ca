<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useHead } from '@unhead/vue'

import { AUTHOR_NAME } from '@/constants'
import { DEFAULT_LOCALE, LOCALE_NAMES, LOCALE_TAGS, LOCALES, preferredLocale } from '@/locale'
import { MESSAGES } from '@/messages'
import { pagePath, pageUrl } from '@/routes'

// DEV NOTE: Rendered for the unprefixed paths (/, /books, ...). With JavaScript, visitors go straight
//           to their preferred locale (keeping any #hash); without it, they get a link per locale.

const route = useRoute()
const router = useRouter()

const page = route.meta.page ?? 'home'
const targets = LOCALES.map((locale) => ({ locale, path: pagePath(page, locale) }))

useHead({
  title: AUTHOR_NAME,
  meta: [{ name: 'robots', content: 'noindex, follow' }],
  link: [{ rel: 'canonical', href: pageUrl(pagePath(page, DEFAULT_LOCALE)) }],
})

onMounted(() => {
  router.replace({ path: pagePath(page, preferredLocale()), hash: route.hash })
})
</script>

<template>
  <article class="mx-auto max-w-lg px-6 py-12 text-center">
    <h1 class="font-serif text-xl">
      <span v-for="(locale, i) in LOCALES" :key="locale" :lang="LOCALE_TAGS[locale]"
        ><template v-if="i > 0"> / </template>{{ MESSAGES[locale].redirect.title }}</span
      >
    </h1>
    <ul class="mt-6 flex justify-center gap-6">
      <li v-for="{ locale, path } in targets" :key="locale">
        <a :href="path + route.hash" :hreflang="LOCALE_TAGS[locale]" class="btn btn-neutral">
          {{ LOCALE_NAMES[locale] }}
        </a>
      </li>
    </ul>
  </article>
</template>

<style scoped></style>
