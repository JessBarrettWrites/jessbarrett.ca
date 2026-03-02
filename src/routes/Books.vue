<script setup lang="ts">
import Book from '@/components/Book.vue'
import PageHeader from '@/components/PageHeader.vue'
import Markdown from '@/components/Markdown.vue'
import Footer from '@/components/Footer.vue'
import { parseBooks } from '@/content'

const books = parseBooks()
</script>

<template>
  <article>
    <PageHeader title="Books" />

    <Book
      v-for="(entry, i) in books"
      :key="entry.meta.title"
      :reverse="i % 2 !== 0"
      :featuredUntil="entry.meta.featuredUntil"
      :title="entry.meta.title"
      :subtitle="entry.meta.subtitle"
      :imageSrc="entry.meta.imageSrc"
      :imageAlt="entry.meta.imageAlt"
      :href="entry.meta.href"
      :preorder="entry.meta.preorder"
      :available="entry.meta.available"
    >
      <Markdown v-if="entry.body" class="[&_p]:leading-relaxed [&_p]:opacity-75 [&_p+p]:mt-4">{{ entry.body }}</Markdown>
    </Book>

    <Footer />
  </article>
</template>

<style scoped></style>