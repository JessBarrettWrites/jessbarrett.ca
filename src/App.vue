<script setup lang="ts">
import Nav from '@/components/Nav.vue'
</script>

<template>
  <Nav title="Jessica Barrett">
    <router-view v-slot="{ Component }">
      <transition name="fade">
        <component :is="Component" />
      </transition>
    </router-view>
  </Nav>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 80%;
}
</style>
