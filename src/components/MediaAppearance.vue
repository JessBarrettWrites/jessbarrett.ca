<script setup lang="ts">
import { toRef } from 'vue'
import AmDash from '@/components/AmDash.vue'
import { formatDate, useLocale } from '@/locale'
import type { MediaAppearance } from '@/types'

const props = defineProps<{
  appearance: MediaAppearance
}>()

const locale = useLocale()
const appearance = toRef(props, 'appearance')
</script>

<template>
  <a
    :href="appearance.url"
    target="_blank"
    rel="noopener noreferrer"
    class="group flex flex-col gap-1"
  >
    <span
      class="font-serif text-xl font-bold italic text-neutral group-hover:underline underline-offset-4"
    >
      {{ appearance.title }}
    </span>
    <span class="text-sm opacity-50">
      <span class="font-serif italic">{{ appearance.outlet }}</span>
      &nbsp;<AmDash />&nbsp;
      {{ formatDate(appearance.date, locale) }}
    </span>
  </a>
  <p v-if="appearance.description" class="mt-2 text-sm opacity-70 leading-relaxed">
    {{ appearance.description }}
  </p>
</template>
