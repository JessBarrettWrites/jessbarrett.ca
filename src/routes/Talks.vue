<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useHead } from '@unhead/vue'

import TalksContent from '@/components/TalksContent.vue'
import { AUTHOR_NAME } from '@/constants'
import { useTalks, useTalksPage } from '@/content'
import { pageUrl } from '@/routes'

const route = useRoute()
const talksPage = useTalksPage()
const talks = useTalks()

const description = talksPage.subtitle ?? `Public speaking by ${AUTHOR_NAME}.`
const metaDescription = `Talks — ${AUTHOR_NAME}`

useHead({
  title: 'Talks',
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
