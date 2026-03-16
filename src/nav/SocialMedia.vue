<script setup lang="ts">
import { useContacts } from '@/content.ts'
import { computed } from 'vue'

const contacts = useContacts()
const mailTo = computed(() => 'mailto:' + contacts.email)
</script>
<template>
  <a
    v-if="contacts.instagram"
    :href="contacts.instagram"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Instagram"
    class="btn btn-ghost btn-circle btn-sm [--btn-color:var(--color-neutral-content)]"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      class="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  </a>
  <a
    v-if="contacts.email"
    :href="mailTo"
    aria-label="Email"
    class="btn btn-ghost btn-circle btn-sm [--btn-color:var(--color-neutral-content)]"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      class="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  </a>
</template>
