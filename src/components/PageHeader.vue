<script setup lang="ts">
defineProps<{ title: string; subtitle?: string }>()
</script>

<template>
  <section class="bg-base-200 px-6 py-24 text-center">
    <h1 class="font-serif text-6xl font-bold tracking-tight">{{ title }}</h1>
    <p v-if="subtitle" class="font-serif mx-auto mt-5 max-w-lg text-xl italic opacity-60">
      {{ subtitle }}
    </p>
  </section>
</template>

<style scoped></style>
