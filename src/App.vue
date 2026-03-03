<script setup lang="ts">
import { useHead } from '@unhead/vue'
import Nav from '@/components/Nav.vue'
// import { usePreferredReducedMotion } from '@vueuse/core'

// const allowTransitions = usePreferredReducedMotion()

useHead({
  titleTemplate: (title) => title === 'Jessica Barrett' ? title : `${title} — Jessica Barrett`,
})
</script>

<template>
  <Nav title="Jessica Barrett" subtitle="Author">
    <router-view v-slot="{ Component }">
      <component :is="Component" />
    </router-view>
  </Nav>
</template>

<style scoped></style>
