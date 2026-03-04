<script setup lang="ts">
import { useSlots } from 'vue'

defineProps<{ title: string }>()

const slots = useSlots()
</script>

<template>
  <section class="px-6 py-6 text-center bg-neutral text-neutral-content">
    <h1 class="font-serif text-4xl font-bold tracking-tight md:text-6xl">{{ title }}</h1>
    <p
      v-if="slots.subtitle"
      class="font-serif mx-auto mt-2 max-w-lg text-md italic opacity-80 md:text-xl"
    >
      <slot name="subtitle" />
    </p>
    <p v-if="slots.default" class="mx-auto mt-3 max-w-lg text-sm opacity-80 md:text-lg">
      <slot />
    </p>
  </section>
</template>

<style scoped></style>
