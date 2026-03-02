<script setup lang="ts">
import Book from '@/components/Book.vue'
import Testimonial from '@/components/Testimonial.vue'
import Footer from '@/components/Footer.vue'
import { parseBooks, parseTestimonials } from '@/content'

const books = parseBooks()
const testimonials = parseTestimonials()
const today = new Date()
const featured = books.filter((b) => !!b.meta.featuredUntil && today <= b.meta.featuredUntil)
const featuredBooks = featured.length > 0 ? featured : books.slice(0, 1)
</script>

<template>
  <article>
    <Book
      v-for="entry in featuredBooks"
      :key="entry.meta.title"
      :featuredUntil="entry.meta.featuredUntil"
      :title="entry.meta.title"
      :subtitle="entry.meta.subtitle"
      :imageSrc="entry.meta.imageSrc"
      :imageAlt="entry.meta.imageAlt"
      :href="entry.meta.href"
      :preorder="entry.meta.preorder"
      :available="entry.meta.available"
    />

    <section class="mx-auto max-w-4xl px-6 pb-20">
      <div class="grid gap-10 md:grid-cols-2">
        <Testimonial
          v-for="t in testimonials"
          :key="t.name"
          :quote="t.quote"
          :name="t.name"
          :role="t.role"
        />
      </div>
    </section>

    <Footer />
  </article>
</template>

<style scoped></style>
