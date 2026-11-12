<script setup lang="ts">
import { toRef } from 'vue'
import { RouterLink } from 'vue-router'
import AmDashMarkdown from '@/components/AmDashMarkdown.vue'
import { useMessages } from '@/messages'
import type { Testimonial } from '@/types'

const props = defineProps<{
  testimonial: Testimonial
  onTitle?: string
  onTitleUrl?: string
}>()

const testimonial = toRef(props, 'testimonial')
const messages = useMessages()
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
        <!-- DEV NOTE: Explicit {{ ' ' }} spaces, at the caption's text size rather than text-xs: Vue
                       drops the whitespace between tags on separate lines -->
        <span class="font-serif text-lg font-bold">{{ testimonial.name }}</span>
        <template v-if="onTitle"
          >{{ ' ' }}<span class="text-xs opacity-50">{{ messages.testimonialOn }}</span
          >{{ ' ' }}</template
        >
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
