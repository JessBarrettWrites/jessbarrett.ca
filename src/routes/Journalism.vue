<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useHead } from '@unhead/vue'

import JournalismArticle from '@/components/JournalismArticle.vue'
import PageHeader from '@/components/PageHeader.vue'
import Footer from '@/components/Footer.vue'
import { AUTHOR_NAME } from '@/constants'
import { useJournalismArticles } from '@/content'
import { articleDateSort } from '@/presentation'
import { pageUrl } from '@/routes'

const route = useRoute()
const articles = useJournalismArticles().sort(articleDateSort)

const description = `Selected reporting and essays by ${AUTHOR_NAME}.`
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
  <article>
    <PageHeader title="Journalism">
      <template #subtitle>Selected reporting and essays</template>
    </PageHeader>

    <section class="mx-auto max-w-4xl px-6 py-6 pb-6">
      <div v-if="articles.length === 0" class="py-12 text-center opacity-50 font-serif italic">
        Coming soon.
      </div>
      <ul v-else class="flex flex-col">
        <li v-for="(article, i) in articles" :key="article.url">
          <hr v-if="i > 0" class="my-4 border-base-content/10" />
          <JournalismArticle :article="article" />
        </li>
      </ul>
    </section>

    <Footer />
  </article>
</template>

<style scoped></style>
