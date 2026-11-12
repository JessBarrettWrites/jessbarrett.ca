<script setup lang="ts">
import { computed, toRef } from 'vue'
import AmDash from '@/components/AmDash.vue'
import { LOCALE_TAGS, useLocale } from '@/locale'
import type { JournalismArticle } from '@/types'
import { articleDateString } from '@/presentation'

const props = defineProps<{
  article: JournalismArticle
}>()

// Format dates for the page's language, not the browser's
const locale = useLocale()
const dateLocale = computed(() => LOCALE_TAGS[locale.value])
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
      {{ articleDateString(article, dateLocale) }}
    </span>
  </a>
  <p v-if="article.description" class="mt-2 text-sm opacity-70 leading-relaxed">
    {{ article.description }}
  </p>
</template>
