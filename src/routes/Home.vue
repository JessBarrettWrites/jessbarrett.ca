<script setup lang="ts">
import { ref } from 'vue'
import { useElementSize } from '@vueuse/core'
import { useHead } from '@unhead/vue'
import Book from '@/components/Book.vue'
import YouTube from '@/components/YouTube.vue'
import Testimonial from '@/components/Testimonial.vue'
import Footer from '@/components/Footer.vue'
import { parseBooks, parseTestimonials } from '@/content'
import { bookDateSort } from '@/presentation'

const today = new Date()

const books = parseBooks().sort(bookDateSort)
const testimonials = parseTestimonials()
const bookBySlug = new Map(books.map((b) => [b.slug, b]))
const featured = books.filter((b) => !!b.meta.featuredUntil && today <= b.meta.featuredUntil)
const featuredBooks = featured.length > 0 ? featured : books.slice(0, 1)

// DEV NOTE: Use a special div to measure the width of the content, and then scale the YouTube
//           iFrame to match that size
const bookMeasureElement = ref<HTMLElement>()
const { width: bookSectionWidth } = useElementSize(bookMeasureElement)

useHead({
  title: 'Jessica Barrett',
  meta: [
    {
      name: 'description',
      content: featuredBooks[0]?.meta.synopsis ?? 'Award-winning journalist and author.',
    },
  ],
  link: featuredBooks.map((b) => ({ rel: 'preload', href: b.meta.imageSrc, as: 'image' })),
})
</script>

<template>
  <div class="pt-6">
    <section>
      <!-- https://www.youtube.com/watch?v=jPS8kGTKric -->
      <YouTube videoId="jPS8kGTKric" :maxWidth="bookSectionWidth" />
    </section>

    <section>
      <div class="mx-auto max-w-4xl px-6" ref="bookMeasureElement"></div>
      <Book
        v-for="book in featuredBooks"
        :key="book.meta.title"
        :slug="book.slug"
        :titleLink="true"
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
      />
    </section>

    <section class="mx-auto max-w-4xl px-6 pb-12">
      <div class="grid gap-10 md:grid-cols-2">
        <Testimonial
          v-for="testimonial in testimonials"
          :key="testimonial.name"
          :quote="testimonial.quote"
          :name="testimonial.name"
          :role="testimonial.role"
          :onTitle="bookBySlug.get(testimonial.book)?.meta.title"
          :onTitleUrl="`/books#${testimonial.book}`"
        />
      </div>
    </section>

    <Footer />
  </div>
</template>

<style scoped></style>
