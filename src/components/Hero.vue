<script setup lang="ts">
const props = defineProps<{ title?: string; description?: string }>()
</script>

<template>
  <section class="hero bg-base-200 min-h-screen">
    <div class="hero-content text-center">
      <div class="max-w-md">
        <h1 v-if="props.title" class="text-5xl font-bold">{{ props.title }}</h1>
        <p v-if="props.description" class="py-6">{{ props.description }}</p>
      </div>
    </div>
  </section>
</template>

<style scoped></style>
