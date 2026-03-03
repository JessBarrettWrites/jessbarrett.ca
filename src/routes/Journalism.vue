<script setup lang="ts">
import { useHead } from '@unhead/vue'
import AmDash from '@/components/AmDash.vue'
import PageHeader from '@/components/PageHeader.vue'
import Footer from '@/components/Footer.vue'
import { parseJournalismArticles } from '@/content'
import { articleDateString, articleDateSort } from '@/presentation'

const locale = navigator.language
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
        <li v-for="article in articles" :key="article.url" class="py-4 flex flex-col gap-2">
          <a
            :href="article.url"
            target="_blank"
            rel="noopener noreferrer"
            class="group flex flex-col gap-1"
          >
            <span class="font-serif text-xl font-bold group-hover:underline underline-offset-4">
              {{ article.title }}
            </span>
            <span class="text-sm opacity-50"
              >{{ article.publication }} <AmDash /> {{ articleDateString(article, locale) }}</span
            >
          </a>
          <p v-if="article.description" class="text-sm opacity-70 leading-relaxed">
            {{ article.description }}
          </p>
        </li>
      </ul>
    </section>

    <Footer />
  </article>
</template>

<style scoped></style>
