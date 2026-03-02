<script setup lang="ts">
defineProps<{ quote: string; name: string; role?: string }>()
</script>

<template>
  <figure class="flex flex-col gap-5 pt-6">
    <blockquote>
      <p class="font-serif text-base leading-relaxed italic opacity-80">"{{ quote }}"</p>
    </blockquote>
    <figcaption class="flex flex-col gap-1">
      <span class="font-serif text-lg font-bold">{{ name }}</span>
      <span v-if="role" class="text-sm opacity-50">{{ role }}</span>
    </figcaption>
  </figure>
</template>

<style scoped></style>
