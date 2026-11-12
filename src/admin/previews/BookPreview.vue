<script setup lang="ts">
import Book from '@/components/Book.vue'
import AmDashMarkdown from '@/components/AmDashMarkdown.vue'
import type { Book as BookType } from '@/types'

// Matches a book on the Books page (routes/Books.vue)
defineProps<{
  book: BookType
}>()
</script>

<template>
  <Book :book="book">
    <AmDashMarkdown v-if="book.body" class="[&_p]:leading-relaxed [&_p]:opacity-75 [&_p+p]:mt-4">
      {{ book.body }}
    </AmDashMarkdown>
  </Book>
</template>
