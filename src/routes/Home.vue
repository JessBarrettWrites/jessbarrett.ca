<script setup lang="ts">
import Book from '@/components/Book.vue'
import Testimonial from '@/components/Testimonial.vue'
import Footer from '@/components/Footer.vue'
import { parseBooks, parseTestimonials } from '@/content'

const today = new Date()

const books = parseBooks()
const testimonials = parseTestimonials()
const bookBySlug = new Map(books.map((b) => [b.slug, b]))
const featured = books.filter((b) => !!b.meta.featuredUntil && today <= b.meta.featuredUntil)
const featuredBooks = featured.length > 0 ? featured : books.slice(0, 1)
</script>

<template>
  <article>
    <Book
      v-for="books in featuredBooks"
      :key="books.meta.title"
      :featuredUntil="books.meta.featuredUntil"
      :title="books.meta.title"
      :subtitle="books.meta.subtitle"
      :imageSrc="books.meta.imageSrc"
      :imageAlt="books.meta.imageAlt"
      :url="books.meta.url"
      :preorder="books.meta.preorder"
      :available="books.meta.available"
    />

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
  </article>
</template>

<style scoped></style>
