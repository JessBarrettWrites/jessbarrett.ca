<script setup lang="ts">
import { computed } from 'vue'

import JournalismArticle from '@/components/JournalismArticle.vue'
import PageHeader from '@/components/PageHeader.vue'
import Footer from '@/components/Footer.vue'
import { useMessages } from '@/messages'
import { articleDateSort } from '@/presentation'
import type { JournalismPage } from '@/types'

const props = defineProps<{
  page: JournalismPage
}>()

const messages = useMessages()
const articles = computed(() => [...props.page.articles].sort(articleDateSort))
</script>

<template>
  <article>
    <PageHeader :title="messages.journalism.title">
      <template v-if="page.description" #subtitle>{{ page.description }}</template>
    </PageHeader>

    <section class="mx-auto w-full max-w-4xl px-6 py-6 pb-6">
      <div v-if="articles.length === 0" class="py-12 text-center opacity-50 font-serif italic">
        {{ messages.journalism.comingSoon }}
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
