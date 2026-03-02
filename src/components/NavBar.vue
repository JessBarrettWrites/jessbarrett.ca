<script setup lang="ts">
import ThemeToggle from '@/components/ThemeToggle.vue'
import { nav } from '@/routes'
import { computed } from 'vue'

const props = defineProps<{ title?: string; subtitle?: string }>()

function clickMenu(e: Event) {
  // Hide menu after clicking on it
  const link = e.currentTarget as HTMLElement
  link?.blur()
}

const navbarText = computed(() => {
  if (props.title && props.subtitle) {
    return `${props.title} am- ${props.subtitle}`
  } else if (props.title) {
    return props.title
  } else {
    return ''
  }
})
</script>

<template>
  <div class="navbar-start">
    <span v-if="props.title" class="btn btn-ghost text-lg sm:text-xl">
      <span class="sm:hidden">{{ props.title }}</span>
      <span class="hidden sm:inline">{{ navbarText }}</span>
    </span>
  </div>
  <nav class="navbar-end text-right hidden md:inline">
    <ul class="inline-block px-2" v-for="{ to, label } in nav" :key="to">
      <li>
        <RouterLink :to="to">{{ label }}</RouterLink>
      </li>
    </ul>
    <div class="inline-flex items-center gap-1 px-3">
      <a
        href="https://www.instagram.com/jessbarrett_writes"
        target="_blank"
        aria-label="Instagram"
        class="btn btn-ghost btn-circle btn-sm"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
        </svg>
      </a>
      <a
        href="mailto:hello@jessbarrett.ca"
        aria-label="Email"
        class="btn btn-ghost btn-circle btn-sm"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
          <polyline points="22,6 12,13 2,6"/>
        </svg>
      </a>
    </div>
    <div class="inline-block px-2">
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
        <li class="mt-1 pt-1 border-t border-base-content/10">
          <div class="flex justify-end gap-2 px-2 py-1">
            <a
              href="https://www.instagram.com/jessbarrett_writes"
              target="_blank"
              aria-label="Instagram"
              class="btn btn-ghost btn-circle btn-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
              </svg>
            </a>
            <a
              href="mailto:hello@jessbarrett.ca"
              aria-label="Email"
              class="btn btn-ghost btn-circle btn-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
            </a>
          </div>
        </li>
      </menu>
    </nav>
  </div>
</template>

<style scoped></style>
