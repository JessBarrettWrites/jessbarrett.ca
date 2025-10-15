<script setup lang="ts">
import ThemeToggle from '@/components/ThemeToggle.vue'

const routes = [
  { to: '/', label: 'Home' },
  { to: '/portfolio', label: 'Portfolio' },
  { to: '/about', label: 'About' },
]

function clickMenu(e: Event) {
  // Hide menu after clicking on it
  const link = e.currentTarget as HTMLElement
  link?.blur()
}
</script>

<template>
  <header class="navbar bg-base-100 shadow-sm">
    <div class="navbar-start">
      <span class="btn btn-ghost text-xl">Jessica Barrett</span>
    </div>
    <div class="navbar-end text-right hidden md:inline">
      <div class="inline-block px-2" v-for="{ to, label } in routes" :key="to">
        <RouterLink :to="to">{{ label }}</RouterLink>
      </div>
      <div class="inline-block px-4">
        <ThemeToggle />
      </div>
    </div>
    <div class="navbar-end visible md:hidden">
      <div class="inline-block px-2">
        <ThemeToggle />
      </div>
      <div class="dropdown dropdown-end">
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
        <ul
          tabindex="-1"
          class="menu menu-md dropdown-content bg-base-100 rounded-box z-1 mt-3 p-2 shadow items-end"
        >
          <li v-for="{ to, label } in routes" :key="to">
            <RouterLink @click="clickMenu" :to="to">{{ label }}</RouterLink>
          </li>
        </ul>
      </div>
    </div>
  </header>
  <main class="flex fixed w-screen">
    <slot></slot>
  </main>
</template>

<style scoped></style>
