<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useHead } from '@unhead/vue'

import PageHeader from '@/components/PageHeader.vue'
import Footer from '@/components/Footer.vue'
import Talk from '@/components/Talk.vue'
import AmDashMarkdown from '@/components/AmDashMarkdown.vue'
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
  <article>
    <PageHeader :title="talksPage.title">
      <template #subtitle>{{ talksPage.subtitle }}</template>
      <template #default>
        <AmDashMarkdown class="[&_a]:underline [&_a]:underline-offset-2">
          {{ talksPage.body }}
        </AmDashMarkdown>
      </template>
    </PageHeader>

    <section class="mx-auto max-w-6xl px-6 py-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Talk v-for="talk in talks" :key="talk.slug" :talk="talk">
          <AmDashMarkdown>{{ talk.body }}</AmDashMarkdown>
        </Talk>
      </div>
    </section>

    <Footer />
  </article>
</template>

<style scoped></style>
