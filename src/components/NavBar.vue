<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

import AmDash from '@/components/AmDash.vue'
import ThemeToggle from '@/components/ThemeToggle.vue'
import SocialMedia from '@/components/SocialMedia.vue'
import { nav } from '@/routes'

const route = useRoute()

const props = defineProps<{ title?: string; subtitle?: string }>()

const isMenuOpen = ref(false)

watch(route, () => {
  isMenuOpen.value = false
})
</script>

<template>
  <div class="navbar-start mt-1 w-auto!">
    <RouterLink to="/" :aria-current="route.path === '/' ? 'page' : undefined">
      <span v-if="props.title" class="btn btn-ghost text-lg md:text-xl [--btn-color:var(--color-neutral-content)]">
        <span v-if="props.title" class="lg:hidden">{{ props.title }}</span>
        <span v-if="props.title && props.subtitle" class="hidden lg:inline">
          {{ props.title }} <AmDash /> {{ props.subtitle }}
        </span>
        <span v-else-if="props.title" class="hidden lg:inline">{{ props.title }}</span>
        <span v-else></span>
      </span>
    </RouterLink>
  </div>
  <nav class="navbar-end text-right hidden md:flex items-center flex-1!">
    <ul class="flex items-center mt-1" v-for="{ to, label } in nav" :key="to">
      <li>
        <RouterLink
          class="btn btn-ghost px-2 [--btn-color:var(--color-neutral-content)]"
          :to="to"
          :aria-current="route.path === to ? 'page' : undefined"
          >{{ label }}</RouterLink
        >
      </li>
    </ul>
    <div class="flex items-center gap-1 px-2">
      <SocialMedia />
    </div>
    <div class="flex items-center px-2">
      <ThemeToggle />
    </div>
  </nav>
  <div class="navbar-end visible md:hidden flex-1!">
    <div class="inline-block px-2">
      <ThemeToggle />
    </div>
    <div
      v-if="isMenuOpen"
      class="fixed inset-0 z-0"
      aria-hidden="true"
      @click="isMenuOpen = false"
    />
    <nav class="relative z-10">
      <button
        type="button"
        aria-label="Open menu"
        aria-haspopup="menu"
        :aria-expanded="isMenuOpen"
        class="btn btn-ghost btn-circle"
        @click="isMenuOpen = !isMenuOpen"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          class="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h7"
          />
        </svg>
      </button>
      <menu
        v-if="isMenuOpen"
        class="menu menu-md absolute right-0 top-full bg-neutral text-neutral-content rounded-box mt-3 p-2 shadow [html[data-theme=black]_&]:shadow-white/20 items-end min-w-40"
      >
        <li v-for="{ to, label } in nav" :key="to">
          <RouterLink
            class="btn btn-ghost px-2 [--btn-color:var(--color-neutral-content)]"
            :to="to"
            :aria-current="route.path === to ? 'page' : undefined"
            @click="isMenuOpen = false"
            >{{ label }}</RouterLink
          >
        </li>
        <li class="mt-1 pt-1 border-t border-base-content/10">
          <div class="flex justify-end gap-2 px-2 py-1">
            <SocialMedia />
          </div>
        </li>
      </menu>
    </nav>
  </div>
</template>

<style scoped></style>
