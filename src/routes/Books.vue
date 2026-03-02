<script setup lang="ts">
import BookPromo from '@/components/BookPromo.vue'
import PageHeader from '@/components/PageHeader.vue'
import Footer from '@/components/Footer.vue'
</script>

<template>
  <article>
    <PageHeader title="Books" />

    <BookPromo
      label="Featured Book"
      title="No Place Like Home"
      subtitle="The Missing Key to Our Housing Crisis"
      imageSrc="/images/book-cover.jpg"
      imageAlt="No Place Like Home Book Cover"
      href="https://www.penguinrandomhouse.ca/books/760899/no-place-like-home-by-jessica-barrett/9780735250253"
    >
      <p class="font-serif font-bold text-md opacity-80">Available for Pre-Order</p>
    </BookPromo>

    <Footer />
  </article>
</template>

<style scoped></style>
