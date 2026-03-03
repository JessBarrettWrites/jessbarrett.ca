<script setup lang="ts">
import AmDash from '@/components/AmDash.vue'
import { articleDateString } from '@/presentation'

const props = defineProps<{
  title: string
  publication: string
  date: Date
  url: string
  description?: string
  locale: string
}>()
</script>

<template>
  <a
    :href="props.url"
    target="_blank"
    rel="noopener noreferrer"
    class="group flex flex-col gap-1"
  >
    <span
      class="font-serif text-xl font-bold italic text-neutral group-hover:underline underline-offset-4"
    >
      {{ props.title }}
    </span>
    <span class="text-sm opacity-50">
      <span class="font-serif italic">{{ props.publication }}</span>
      &nbsp;<AmDash />&nbsp;
      {{ articleDateString(props, props.locale) }}
    </span>
  </a>
  <p v-if="props.description" class="mt-2 text-sm opacity-70 leading-relaxed">
    {{ props.description }}
  </p>
</template>