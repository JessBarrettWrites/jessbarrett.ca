<script setup lang="ts">
import { toRef } from 'vue'
import AmDash from '@/components/AmDash.vue'
import { formatDate, useLocale } from '@/locale'
import type { JournalismArticle } from '@/types'

const props = defineProps<{
  article: JournalismArticle
}>()

const locale = useLocale()
const article = toRef(props, 'article')
</script>

<template>
  <a
    :href="article.url"
    target="_blank"
    rel="noopener noreferrer"
    class="group flex flex-col gap-1"
  >
    <span
      class="font-serif text-xl font-bold italic text-neutral group-hover:underline underline-offset-4"
    >
      {{ article.title }}
    </span>
    <span class="text-sm opacity-50">
      <span class="font-serif italic">{{ article.publication }}</span>
      &nbsp;<AmDash />&nbsp;
      {{ formatDate(article.date, locale) }}
    </span>
  </a>
  <p v-if="article.description" class="mt-2 text-sm opacity-70 leading-relaxed">
    {{ article.description }}
  </p>
</template>
