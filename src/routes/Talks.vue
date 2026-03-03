<script setup lang="ts">
import { useHead } from '@unhead/vue'
import PageHeader from '@/components/PageHeader.vue'
import Footer from '@/components/Footer.vue'
import Talk from '@/components/Talk.vue'
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

    <section class="mx-auto max-w-6xl px-6 py-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Talk v-for="talk in talks" :key="talk.slug" :slug="talk.slug" :title="talk.meta.title">
          <Markdown>{{ talk.body }}</Markdown>
        </Talk>
      </div>
    </section>

    <Footer />
  </article>
</template>

<style scoped></style>
