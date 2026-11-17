<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useHead } from '@unhead/vue'

import Book from '@/components/Book.vue'
import PageHeader from '@/components/PageHeader.vue'
import AmDashMarkdown from '@/components/AmDashMarkdown.vue'
import Footer from '@/components/Footer.vue'
import { AUTHOR_NAME } from '@/constants'
import { useBooks } from '@/content'
import { usePageHead } from '@/head'
import { LOCALE_TAGS, useLocale } from '@/locale'
import { useMessages } from '@/messages'
import { bookDateSort } from '@/presentation'
import { pageUrl } from '@/routes'

const route = useRoute()
const locale = useLocale()
const messages = useMessages()
const books = useBooks(locale.value).sort(bookDateSort)

const title = messages.value.books.title
const description = messages.value.books.description
const fullTitle = usePageHead({ title, description })

useHead({
  link: books.map((b) => ({ rel: 'preload', href: b.imageSrc, as: 'image' as const })),
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: fullTitle.value,
        url: pageUrl(route.path),
        inLanguage: LOCALE_TAGS[locale.value],
        mainEntity: books.map((book) => ({
          '@type': 'Book',
          name: book.title,
          ...(book.subtitle && { alternateName: `${book.title}: ${book.subtitle}` }),
          author: { '@type': 'Person', name: AUTHOR_NAME },
          ...(book.synopsis && { description: book.synopsis }),
          ...(book.url && { url: book.url }),
          ...(book.imageSrc && { image: pageUrl(book.imageSrc) }),
          ...(book.available && { datePublished: book.available.toISOString().slice(0, 10) }),
        })),
      }),
    },
  ],
})
</script>

<template>
  <article>
    <PageHeader :title="title" />

    <Book v-for="(book, i) in books" :key="book.title" :book="book" :reverse="i % 2 !== 0">
      <AmDashMarkdown v-if="book.body" class="[&_p]:leading-relaxed [&_p]:opacity-75 [&_p+p]:mt-4">
        {{ book.body }}
      </AmDashMarkdown>
    </Book>

    <Footer />
  </article>
</template>

<style scoped></style>
