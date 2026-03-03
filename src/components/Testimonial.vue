<script setup lang="ts">
import { toRef } from 'vue'
import { RouterLink } from 'vue-router'
import AmDashMarkdown from '@/components/AmDashMarkdown.vue'
import type { Testimonial } from '@/types'

const props = defineProps<{
  testimonial: Testimonial
  onTitle?: string
  onTitleUrl?: string
}>()

const testimonial = toRef(props, 'testimonial')
</script>

<template>
  <figure class="flex flex-col gap-5 pt-3">
    <blockquote>
      <p class="font-serif text-base leading-relaxed italic opacity-80">
        <AmDashMarkdown>"{{ testimonial.quote }}"</AmDashMarkdown>
      </p>
    </blockquote>
    <figcaption class="flex flex-col gap-1">
      <p>
        <span class="font-serif text-lg font-bold">{{ testimonial.name }}</span>
        <span class="text-xs opacity-50" v-if="onTitle"> on </span>
        <RouterLink
          v-if="onTitle && onTitleUrl"
          :to="onTitleUrl"
          class="text-xs opacity-50 italic hover:opacity-100"
          >{{ onTitle }}</RouterLink
        >
        <span v-else-if="onTitle" class="text-xs opacity-50 italic">{{ onTitle }}</span>
      </p>
      <span v-if="testimonial.role" class="text-sm opacity-50">{{ testimonial.role }}</span>
    </figcaption>
  </figure>
</template>

<style scoped></style>
