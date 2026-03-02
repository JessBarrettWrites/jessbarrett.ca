<script setup lang="ts">
defineProps<{ title: string; subtitle?: string }>()
</script>

<template>
  <section class="bg-base-200 px-6 py-6 text-center sm:py-12">
    <h1 class="font-serif text-4xl font-bold tracking-tight md:text-6xl">{{ title }}</h1>
    <p
      v-if="subtitle"
      class="font-serif mx-auto mt-3 max-w-lg text-md italic opacity-60 md:mt-2 md:text-xl"
    >
      {{ subtitle }}
    </p>
  </section>
</template>

<style scoped></style>
