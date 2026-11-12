<script setup lang="ts">
import { ref } from 'vue'
import { useElementSize, useOnline } from '@vueuse/core'
import { useHead } from '@unhead/vue'

import Book from '@/components/Book.vue'
import YouTube from '@/components/YouTube.vue'
import Testimonial from '@/components/Testimonial.vue'
import Footer from '@/components/Footer.vue'
import { AUTHOR_NAME } from '@/constants'
import { useBooks, useTestimonials } from '@/content'
import { useLocale } from '@/locale'
import { useMessages } from '@/messages'
import { bookDateSort, featuredBookFilter } from '@/presentation'
import { pagePath } from '@/routes'

const locale = useLocale()
const messages = useMessages()
const booksPath = pagePath('books', locale.value)

const today = new Date()
const books = useBooks(locale.value).sort(bookDateSort)
const testimonials = useTestimonials(locale.value)
const bookBySlug = new Map(books.map((b) => [b.slug, b]))
const featured = books.filter(featuredBookFilter(today))
const featuredBooks = featured.length > 0 ? featured : books.slice(0, 1)

// DEV NOTE: Use a special div to measure the width of the content, and then scale the YouTube
//           iFrame to match that size
const bookMeasureElement = ref<HTMLElement>()
const { width: bookSectionWidth } = useElementSize(bookMeasureElement)

const description = featuredBooks[0]?.synopsis ?? messages.value.home.description
const metaDescription = `${messages.value.nav.home} — ${AUTHOR_NAME}`

useHead({
  title: AUTHOR_NAME,
  meta: [
    { name: 'description', content: description },
    { property: 'og:title', content: metaDescription },
    { property: 'og:description', content: description },
  ],
  link: featuredBooks.map((b) => ({ rel: 'preload', href: b.imageSrc, as: 'image' as const })),
})

const isOnline = useOnline()
</script>

<template>
  <div class="pt-6">
    <section v-if="isOnline">
      <!-- https://www.youtube.com/watch?v=jPS8kGTKric -->
      <YouTube
        :title="messages.home.trailerTitle"
        videoId="jPS8kGTKric"
        :maxWidth="bookSectionWidth"
      />
    </section>

    <section>
      <div class="mx-auto max-w-4xl px-6" ref="bookMeasureElement"></div>
      <Book v-for="book in featuredBooks" :key="book.title" :book="book" :titleLink="true" />
    </section>

    <section class="mx-auto max-w-4xl px-6 pb-12">
      <div class="grid gap-10 md:grid-cols-2">
        <Testimonial
          v-for="testimonial in testimonials"
          :key="testimonial.name"
          :testimonial="testimonial"
          :onTitle="bookBySlug.get(testimonial.book)?.title"
          :onTitleUrl="`${booksPath}#${testimonial.book}`"
        />
      </div>
    </section>

    <Footer />
  </div>
</template>

<style scoped></style>
