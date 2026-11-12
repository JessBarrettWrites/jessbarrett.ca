<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useHead } from '@unhead/vue'

import JournalismContent from '@/components/JournalismContent.vue'
import { AUTHOR_NAME } from '@/constants'
import { useJournalismPage } from '@/content'
import { articleDateSort } from '@/presentation'
import { pageUrl } from '@/routes'

const route = useRoute()
const page = useJournalismPage()
const articles = [...page.articles].sort(articleDateSort)

const description = `${page.description ?? 'Reporting and essays'} by ${AUTHOR_NAME}.`
const metaDescription = `Journalism — ${AUTHOR_NAME}`

useHead({
  title: 'Journalism',
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
        mainEntity: articles.map((article) => ({
          '@type': 'ReportageNewsArticle',
          headline: article.title,
          url: article.url,
          datePublished: article.date.toISOString().slice(0, 10),
          author: { '@type': 'Person', name: AUTHOR_NAME },
          publisher: { '@type': 'Organization', name: article.publication },
          ...(article.description && { description: article.description }),
        })),
      }),
    },
  ],
})
</script>

<template>
  <JournalismContent :page="page" />
</template>

<style scoped></style>
