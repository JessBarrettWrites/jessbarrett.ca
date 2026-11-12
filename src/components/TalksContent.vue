<script setup lang="ts">
import PageHeader from '@/components/PageHeader.vue'
import Footer from '@/components/Footer.vue'
import Talk from '@/components/Talk.vue'
import AmDashMarkdown from '@/components/AmDashMarkdown.vue'
import type { Talk as TalkType, TalksPage } from '@/types'

defineProps<{
  page: TalksPage
  talks: TalkType[]
}>()
</script>

<template>
  <article>
    <PageHeader :title="page.title">
      <template #subtitle>{{ page.subtitle }}</template>
      <template v-if="page.description" #default>
        <AmDashMarkdown class="[&_a]:underline [&_a]:underline-offset-2">
          {{ page.description }}
        </AmDashMarkdown>
      </template>
    </PageHeader>

    <section class="mx-auto max-w-6xl px-6 py-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Talk v-for="talk in talks" :key="talk.slug" :talk="talk">
          <AmDashMarkdown>{{ talk.body }}</AmDashMarkdown>
        </Talk>
      </div>
    </section>

    <Footer />
  </article>
</template>

<style scoped></style>
