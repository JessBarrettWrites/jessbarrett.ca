<script setup lang="ts">
import { useHead } from '@unhead/vue'
import PageHeader from '@/components/PageHeader.vue'
import Footer from '@/components/Footer.vue'
import Markdown from '@/components/Markdown.vue'
import { parseTalks, parseTalksPage } from '@/content'

const { meta, body: intro } = parseTalksPage()
const talks = parseTalks()

useHead({
  title: 'Talks',
  meta: [{ name: 'description', content: meta.subtitle ?? 'Public speaking by Jessica Barrett.' }],
})
</script>

<template>
  <article>
    <PageHeader :title="meta.title">
      <template #subtitle>{{ meta.subtitle }}</template>
      <template #default>
        <Markdown class="[&_a]:underline [&_a]:underline-offset-2">{{ intro }}</Markdown>
      </template>
    </PageHeader>

    <section class="mx-auto max-w-4xl px-6 py-12">
      <ul class="flex flex-col gap-10">
        <li v-for="talk in talks" :key="talk.slug">
          <h3 class="font-serif text-xl font-bold mb-2">{{ talk.meta.title }}</h3>
          <Markdown class="leading-relaxed opacity-90 [&_a]:underline [&_a]:underline-offset-2">{{
            talk.body
          }}</Markdown>
        </li>
      </ul>
    </section>

    <Footer />
  </article>
</template>

<style scoped></style>
