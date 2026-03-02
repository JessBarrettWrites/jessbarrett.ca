<script setup lang="ts">
import ThemeToggle from '@/components/ThemeToggle.vue'
import SocialMedia from '@/components/SocialMedia.vue'
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
  <div class="navbar-start w-auto!">
    <span v-if="props.title" class="btn btn-ghost text-lg md:text-xl">
      <span class="lg:hidden">{{ props.title }}</span>
      <span class="hidden lg:inline">{{ navbarText }}</span>
    </span>
  </div>
  <nav class="navbar-end text-right hidden md:inline flex-1!">
    <ul class="inline-block px-2" v-for="{ to, label } in nav" :key="to">
      <li>
        <RouterLink :to="to">{{ label }}</RouterLink>
      </li>
    </ul>
    <div class="inline-flex items-center gap-1 px-3">
      <SocialMedia />
    </div>
    <div class="inline-block px-2">
      <ThemeToggle />
    </div>
  </nav>
  <div class="navbar-end visible md:hidden flex-1!">
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
        class="menu menu-md dropdown-content bg-neutral text-neutral-content rounded-box z-1 mt-3 p-2 shadow items-end"
      >
        <li v-for="{ to, label } in nav" :key="to">
          <RouterLink @click="clickMenu" :to="to">{{ label }}</RouterLink>
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
