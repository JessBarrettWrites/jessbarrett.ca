<script setup lang="ts">
import BookPromo from '@/components/BookPromo.vue'
import Testimonial from '@/components/Testimonial.vue'
import Footer from '@/components/Footer.vue'
</script>

<template>
  <article>
    <BookPromo
      label="Featured Book"
      title="No Place Like Home"
      subtitle="The Missing Key to Our Housing Crisis"
      imageSrc="/images/book-cover.jpg"
      imageAlt="No Place Like Home Book Cover"
      href="https://www.penguinrandomhouse.ca/books/760899/no-place-like-home-by-jessica-barrett/9780735250253"
    >
      <p class="font-serif font-bold text-md opacity-80">Available Now</p>
    </BookPromo>

    <section class="mx-auto max-w-4xl px-6 pb-20">
      <p class="font-serif text-md uppercase tracking-widest opacity-50 mb-10">Advance Praise</p>
      <div class="grid gap-10 md:grid-cols-2">
        <Testimonial
          quote="In No Place Like Home, Jessica Barrett thoughtfully examines the housing crisis from all angles, putting together a clear playbook for one of the biggest problems we collectively face."
          name="Kyla Scanlon"
          role="Economist and author of In This Economy?"
        />
        <Testimonial
          quote="No Place Like Home is an essential read for anyone who cares about the future of housing. Through sharp reporting and rich storytelling, Jessica Barrett proves that we can fix the abiding crisis of our time. This book gave me hope."
          name="Charles Montgomery"
          role="Author of Happy City and co-founder of Happy Cities"
        />
        <Testimonial
          quote="A soulful antidote to our housing crisis. A rallying cry that preserves and decommodifies the very human idea of 'home.' Barrett describes, in elegant prose, why today's conception of shelter as an investor-focused asset is doomed to fail. Then she points the way past toxic real estate and toward real homes and real communities. Vital and fascinating!"
          name="Michael Harris"
          role="Author of All We Want and The End of Absence"
        />
        <Testimonial
          quote="No Place Like Home is an incredible feat: an intricately woven examination of the fundamental concept of home that forces the reader to reexamine the question of the housing crisis from an entirely new angle—one filled with humanity and, somehow, hope. Barrett manages a complex task as a writer in these pages, balancing the vulnerability of memoir with the rigour of journalistic research; the end result is compelling and urgent, personal and political, worrisome and optimistic."
          name="Christina Myers"
          role="Author of The List of Last Chances and Halfway Home"
        />
      </div>
    </section>

    <Footer />
  </article>
</template>

<style scoped></style>