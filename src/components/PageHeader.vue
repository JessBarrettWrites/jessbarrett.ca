<script setup lang="ts">
defineProps<{ title: string; subtitle?: string }>()
</script>

<template>
  <section class="bg-base-200 px-6 py-6 text-center sm:py-18">
    <h1 class="font-serif text-3xl font-bold tracking-tight md:text-6xl">{{ title }}</h1>
    <p
      v-if="subtitle"
      class="font-serif mx-auto mt-3 max-w-lg text-sm italic opacity-60 md:mt-5 md:text-xl"
    >
      {{ subtitle }}
    </p>
  </section>
</template>

<style scoped></style>
