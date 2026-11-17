<script setup lang="ts">
import { computed } from 'vue'

import Book from '@/components/Book.vue'
import Nav from '@/components/Nav.vue'
import Testimonial from '@/components/Testimonial.vue'
import { AUTHOR_NAME } from '@/constants'
import { useBooks, useTestimonials } from '@/content'
import { useLocale } from '@/locale'
import { useMessages } from '@/messages'
import { bookDateSort } from '@/presentation'

// The interface text (ui.toml) around the saved content: the header and its menu, the latest book
// (its badges, button and "Read more") and its testimonials. The text being edited is provided by
// the preview (MESSAGES_KEY), so every component shows it in place of the saved text.
const locale = useLocale()
const messages = useMessages()
const book = computed(() => useBooks(locale.value).sort(bookDateSort)[0])
const testimonials = computed(() =>
  useTestimonials(locale.value).filter((testimonial) => testimonial.book === book.value?.slug),
)
</script>

<template>
  <Nav :title="AUTHOR_NAME" :subtitle="messages.author">
    <article>
      <Book v-if="book" :book="book" :titleLink="true" />
      <section class="mx-auto max-w-4xl px-6 pb-12">
        <div class="grid gap-10 md:grid-cols-2">
          <Testimonial
            v-for="testimonial in testimonials"
            :key="testimonial.name"
            :testimonial="testimonial"
            :onTitle="book?.title"
          />
        </div>
      </section>
    </article>
  </Nav>
</template>
