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
