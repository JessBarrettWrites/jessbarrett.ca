<script setup lang="ts">
defineProps<{ title: string }>()
</script>

<template>
  <section class="mx-auto max-w-4xl px-6 py-20">
    <h2 class="font-serif mb-12 text-4xl font-bold">{{ title }}</h2>
    <div class="grid gap-10 md:grid-cols-3">
      <slot />
    </div>
  </section>
</template>

<style scoped></style>