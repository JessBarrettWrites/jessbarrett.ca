<script setup lang="ts">
import Nav from '@/components/Nav.vue'
// import { usePreferredReducedMotion } from '@vueuse/core'

// const allowTransitions = usePreferredReducedMotion()
</script>

<template>
  <Nav title="Jessica Barrett" subtitle="Author">
    <router-view v-slot="{ Component }">
      <component :is="Component" />
    </router-view>
  </Nav>
</template>

<style scoped></style>
