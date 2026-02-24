<script setup lang="ts">
defineProps<{ heading: string }>()
</script>

<template>
  <div class="flex flex-col gap-3">
    <h3 class="font-serif text-xl font-bold">{{ heading }}</h3>
    <p class="text-sm leading-relaxed opacity-70">
      <slot />
    </p>
  </div>
</template>

<style scoped></style>