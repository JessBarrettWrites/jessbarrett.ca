<script setup lang="ts">
import NavBar from '@/components/NavBar.vue'

const props = defineProps<{ title?: string; subtitle?: string }>()
</script>

<template>
  <header class="navbar bg-neutral text-neutral-content shadow-sm print:hidden">
    <NavBar :title="props.title" :subtitle="props.subtitle" />
  </header>
  <main class="flex flex-col fixed h-screen w-full overflow-y-auto bg-base-100">
    <slot></slot>
  </main>
</template>

<style scoped></style>
