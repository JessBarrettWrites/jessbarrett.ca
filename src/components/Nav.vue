<script setup lang="ts">
import NavBar from '@/components/NavBar.vue'

const props = defineProps<{ title?: string; subtitle?: string }>()
</script>

<template>
  <div class="flex flex-col h-dvh">
    <header class="navbar bg-neutral text-neutral-content shadow-sm print:hidden">
      <NavBar :title="props.title" :subtitle="props.subtitle" />
    </header>
    <main class="flex flex-col flex-1 overflow-y-auto bg-base-100 [&>article]:flex [&>article]:flex-col [&>article]:flex-1 [&>article]:min-h-full">
      <slot></slot>
    </main>
  </div>
</template>

<style scoped></style>