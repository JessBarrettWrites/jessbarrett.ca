<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useHead } from '@unhead/vue'

import TalksContent from '@/components/TalksContent.vue'
import { AUTHOR_NAME } from '@/constants'
import { useTalks, useTalksPage } from '@/content'
import { LOCALE_TAGS, useLocale } from '@/locale'
import { useMessages } from '@/messages'
import { pageUrl } from '@/routes'

const route = useRoute()
const locale = useLocale()
const messages = useMessages()
const talksPage = useTalksPage(locale.value)
const talks = useTalks(locale.value)

const title = talksPage.title ?? messages.value.talks.title
const description = talksPage.subtitle ?? messages.value.talks.description
const metaDescription = `${title} — ${AUTHOR_NAME}`

useHead({
  title,
  meta: [
    { name: 'description', content: description },
    { property: 'og:title', content: metaDescription },
    { property: 'og:description', content: description },
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: metaDescription,
        url: pageUrl(route.path),
        inLanguage: LOCALE_TAGS[locale.value],
        description,
      }),
    },
  ],
})
</script>

<template>
  <TalksContent :page="talksPage" :talks="talks" />
</template>

<style scoped></style>
