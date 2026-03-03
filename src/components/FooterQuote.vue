<script setup lang="ts">
import AmDashMarkdown from '@/components/AmDashMarkdown.vue'
</script>

<template>
  <section class="flex-1 relative bg-neutral text-neutral-content px-6 pt-6 pb-12">
    <blockquote class="relative mx-auto max-w-2xl text-center text-balance">
      <p class="font-serif text-2xl leading-relaxed italic opacity-80">
        <AmDashMarkdown>"<slot />"</AmDashMarkdown>
      </p>
    </blockquote>
  </section>
</template>

<style scoped></style>
