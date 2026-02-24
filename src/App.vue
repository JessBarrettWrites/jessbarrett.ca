<script setup lang="ts">
import Nav from '@/components/Nav.vue'
import { usePreferredReducedMotion } from '@vueuse/core'

const allowTransitions = usePreferredReducedMotion()
</script>

<template>
  <Nav title="Jessica Barrett am- Author">
    <router-view v-slot="{ Component }">
      <Transition
        v-if="allowTransitions"
        enter-active-class="transition-opacity absolute top-0 left-0 w-full duration-100"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity absolute top-0 left-0 w-full duration-100"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <component :is="Component" />
      </Transition>

      <component v-if="!allowTransitions" :is="Component" />
    </router-view>
  </Nav>
</template>

<style scoped></style>
