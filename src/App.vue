<script setup lang="ts">
import { useHead } from '@unhead/vue'
import Nav from '@/components/Nav.vue'
// import { usePreferredReducedMotion } from '@vueuse/core'

// const allowTransitions = usePreferredReducedMotion()

useHead({
  titleTemplate: (title) => title === 'Jessica Barrett' ? title : `${title} — Jessica Barrett`,
  link: [
    { rel: 'preload', href: '/fonts/timesnewhuman/TimesNewHuman-Reg.woff2', as: 'font', type: 'font/woff2', crossorigin: '' },
    { rel: 'preload', href: '/fonts/timesnewhuman/TimesNewHuman-Bol.woff2', as: 'font', type: 'font/woff2', crossorigin: '' },
    { rel: 'preload', href: '/fonts/areal/Areal.woff2', as: 'font', type: 'font/woff2', crossorigin: '' },
  ],
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
