<script setup lang="ts">
import { useHead } from '@unhead/vue'
import JournalismArticle from '@/components/JournalismArticle.vue'
import PageHeader from '@/components/PageHeader.vue'
import Footer from '@/components/Footer.vue'
import { parseJournalismArticles } from '@/content'
import { articleDateSort } from '@/presentation'

const articles = parseJournalismArticles().sort(articleDateSort)

useHead({
  title: 'Journalism',
  meta: [{ name: 'description', content: 'Selected reporting and essays by Jessica Barrett.' }],
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
