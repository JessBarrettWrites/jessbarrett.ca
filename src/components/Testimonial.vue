<script setup lang="ts">
import { RouterLink } from 'vue-router'
import Markdown from '@/components/Markdown.vue'

defineProps<{ quote: string; name: string; role?: string; onTitle?: string; onTitleUrl?: string }>()
</script>

<template>
  <figure class="flex flex-col gap-5 pt-3">
    <blockquote>
      <p class="font-serif text-base leading-relaxed italic opacity-80">
        <Markdown>"{{ quote }}"</Markdown>
      </p>
    </blockquote>
    <figcaption class="flex flex-col gap-1">
      <p>
        <span class="font-serif text-lg font-bold">{{ name }}</span>
        <span class="text-xs opacity-50" v-if="onTitle"> on </span>
        <RouterLink
          v-if="onTitle && onTitleUrl"
          :to="onTitleUrl"
          class="text-xs opacity-50 italic hover:opacity-100"
          >{{ onTitle }}</RouterLink
        >
        <span v-else-if="onTitle" class="text-xs opacity-50 italic">{{ onTitle }}</span>
      </p>
      <span v-if="role" class="text-sm opacity-50">{{ role }}</span>
    </figcaption>
  </figure>
</template>

<style scoped></style>
