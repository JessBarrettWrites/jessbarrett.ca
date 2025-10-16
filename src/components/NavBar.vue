<script setup lang="ts">
import ThemeToggle from '@/components/ThemeToggle.vue'
import { nav } from '@/routes'

const props = defineProps<{ title?: string }>()

function clickMenu(e: Event) {
  // Hide menu after clicking on it
  const link = e.currentTarget as HTMLElement
  link?.blur()
}
</script>

<template>
  <div class="navbar-start">
    <span v-if="props.title" class="btn btn-ghost text-xl">{{ props.title }}</span>
  </div>
  <nav class="navbar-end text-right hidden md:inline">
    <ul class="inline-block px-2" v-for="{ to, label } in nav" :key="to">
      <li>
        <RouterLink :to="to">{{ label }}</RouterLink>
      </li>
    </ul>
    <div class="inline-block px-4">
      <ThemeToggle />
    </div>
  </nav>
  <div class="navbar-end visible md:hidden">
    <div class="inline-block px-2">
      <ThemeToggle />
    </div>
    <nav class="dropdown dropdown-end">
      <div tabindex="0" role="button" class="btn btn-ghost btn-circle">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h7"
          />
        </svg>
      </div>
      <menu
        tabindex="-1"
        class="menu menu-md dropdown-content bg-base-100 rounded-box z-1 mt-3 p-2 shadow items-end"
      >
        <li v-for="{ to, label } in nav" :key="to">
          <RouterLink @click="clickMenu" :to="to">{{ label }}</RouterLink>
        </li>
      </menu>
    </nav>
  </div>
</template>

<style scoped></style>
