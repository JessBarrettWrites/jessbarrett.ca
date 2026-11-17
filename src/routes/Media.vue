<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useHead } from '@unhead/vue'

import MediaContent from '@/components/MediaContent.vue'
import { AUTHOR_NAME } from '@/constants'
import { useMediaPage } from '@/content'
import { usePageHead } from '@/head'
import { LOCALE_TAGS, useLocale } from '@/locale'
import { format, useMessages } from '@/messages'
import { appearanceDateSort } from '@/presentation'
import { pageUrl } from '@/routes'

const route = useRoute()
const locale = useLocale()
const messages = useMessages()
const page = useMediaPage(locale.value)
const appearances = [...page.appearances].sort(appearanceDateSort)

const title = messages.value.media.title
const description = format(messages.value.media.description, {
  summary: page.description ?? messages.value.media.defaultSummary,
})
const fullTitle = usePageHead({ title, description })

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: fullTitle.value,
        url: pageUrl(route.path),
        inLanguage: LOCALE_TAGS[locale.value],
        description,
        mainEntity: appearances.map((appearance) => ({
          '@type': 'CreativeWork',
          name: appearance.title,
          url: appearance.url,
          datePublished: appearance.date.toISOString().slice(0, 10),
          contributor: { '@type': 'Person', name: AUTHOR_NAME },
          publisher: { '@type': 'Organization', name: appearance.outlet },
          ...(appearance.description && { description: appearance.description }),
        })),
      }),
    },
  ],
})
</script>

<template>
  <MediaContent :page="page" />
</template>

<style scoped></style>
