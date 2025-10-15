<script setup lang="ts">
import NavBar from '@/components/NavBar.vue'

const props = defineProps<{ title?: string }>()
</script>

<template>
  <header class="navbar bg-base-100 shadow-sm">
    <NavBar :title="props.title" />
  </header>
  <main class="flex flex-col fixed h-screen w-full overflow-y-auto bg-base-100">
    <slot></slot>
  </main>
</template>

<style scoped></style>
