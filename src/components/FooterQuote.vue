<script setup lang="ts">
import Markdown from '@/components/Markdown.vue'
</script>

<template>
  <section class="flex-1 relative bg-neutral text-neutral-content px-6 pt-6 pb-12 overflow-hidden">
    <blockquote class="relative mx-auto max-w-2xl text-center text-balance">
      <p class="font-serif text-2xl leading-relaxed italic opacity-80">
        <Markdown>"<slot />"</Markdown>
      </p>
    </blockquote>
  </section>
</template>

<style scoped></style>
