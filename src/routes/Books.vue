<script setup lang="ts">
import { useHead } from '@unhead/vue'
import Book from '@/components/Book.vue'
import PageHeader from '@/components/PageHeader.vue'
import Markdown from '@/components/Markdown.vue'
import Footer from '@/components/Footer.vue'
import { parseBooks } from '@/content'
import { bookDateSort } from '@/presentation'

const books = parseBooks().sort(bookDateSort)

useHead({
  title: 'Books',
  meta: [{ name: 'description', content: 'Books by Jessica Barrett, including No Place Like Home.' }],
})
</script>

<template>
  <article>
    <PageHeader title="Books" />

    <Book
      v-for="(book, i) in books"
      :key="book.meta.title"
      :slug="book.slug"
      :reverse="i % 2 !== 0"
      :featuredUntil="book.meta.featuredUntil"
      :title="book.meta.title"
      :subtitle="book.meta.subtitle"
      :synopsis="book.meta.synopsis"
      :accolades="book.meta.accolades"
      :imageSrc="book.meta.imageSrc"
      :imageAlt="book.meta.imageAlt"
      :url="book.meta.url"
      :preorder="book.meta.preorder"
      :available="book.meta.available"
    >
      <Markdown v-if="book.body" class="[&_p]:leading-relaxed [&_p]:opacity-75 [&_p+p]:mt-4">{{
        book.body
      }}</Markdown>
    </Book>

    <Footer />
  </article>
</template>

<style scoped></style>
