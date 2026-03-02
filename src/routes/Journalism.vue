<script setup lang="ts">
import PageHeader from '@/components/PageHeader.vue'
import Footer from '@/components/Footer.vue'

interface Article {
  title: string
  publication: string
  date: string
  href: string
  description?: string
}

const articles: Article[] = [
  // Add articles here: { title, publication, date, href, description }
]
</script>

<template>
  <article>
    <PageHeader title="Journalism" subtitle="Selected reporting and essays" />

    <section class="mx-auto max-w-4xl px-6 py-12 pb-20">
      <div v-if="articles.length === 0" class="py-12 text-center opacity-50 font-serif italic">
        Coming soon.
      </div>
      <ul v-else class="flex flex-col divide-y divide-base-content/10">
        <li
          v-for="article in articles"
          :key="article.href"
          class="py-8 flex flex-col gap-2"
        >
          <a
            :href="article.href"
            target="_blank"
            class="group flex flex-col gap-1"
          >
            <span class="font-serif text-xl font-bold group-hover:underline underline-offset-4">
              {{ article.title }}
            </span>
            <span class="text-sm opacity-50">{{ article.publication }} &mdash; {{ article.date }}</span>
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