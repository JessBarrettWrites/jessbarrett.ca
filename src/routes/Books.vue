<script setup lang="ts">
import { useHead } from '@unhead/vue'

import Book from '@/components/Book.vue'
import PageHeader from '@/components/PageHeader.vue'
import AmDashMarkdown from '@/components/AmDashMarkdown.vue'
import Footer from '@/components/Footer.vue'
import { parseBooks } from '@/content'
import { bookDateSort } from '@/presentation'

const books = parseBooks().sort(bookDateSort)

useHead({
  title: 'Books',
  meta: [
    { name: 'description', content: 'Books by Jessica Barrett, including No Place Like Home.' },
  ],
  link: books.map((b) => ({ rel: 'preload', href: b.meta.imageSrc, as: 'image' })),
})
</script>

<template>
  <article>
    <PageHeader title="Books" />

    <Book v-for="(book, i) in books" :key="book.meta.title" :book="book" :reverse="i % 2 !== 0">
      <AmDashMarkdown v-if="book.body" class="[&_p]:leading-relaxed [&_p]:opacity-75 [&_p+p]:mt-4">
        {{ book.body }}
      </AmDashMarkdown>
    </Book>

    <Footer />
  </article>
</template>

<style scoped></style>
