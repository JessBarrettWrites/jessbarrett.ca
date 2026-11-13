<script setup lang="ts">
import { computed } from 'vue'

import {
  LOCALE_NAMES,
  LOCALE_TAGS,
  LOCALES,
  type Locale,
  useLocale,
  useSelectLocale,
} from '@/locale'
import { useMessages } from '@/messages'

// Globe button with a dropdown of languages, like the one in the daisyUI docs header. Choosing a
// language shows the current page in it, without changing the URL.

const locale = useLocale()
const selectLocale = useSelectLocale()
const messages = useMessages()

const languages = computed(() =>
  LOCALES.map((l) => ({
    locale: l,
    name: LOCALE_NAMES[l],
    tag: LOCALE_TAGS[l],
    current: l === locale.value,
  })),
)

// DEV NOTE: The dropdown opens while it has focus, so drop focus once a language is chosen
function choose(l: Locale) {
  selectLocale(l)
  if (document.activeElement instanceof HTMLElement) document.activeElement.blur()
}
</script>

<template>
  <div class="dropdown dropdown-end">
    <div
      tabindex="0"
      role="button"
      :aria-label="messages.nav.language"
      :title="messages.nav.language"
      class="btn btn-ghost btn-sm gap-1 px-2 [--btn-color:var(--color-neutral-content)]"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        class="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="1.5"
        aria-hidden="true"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418"
        />
      </svg>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="12"
        height="12"
        class="h-3 w-3 opacity-60"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2.5"
        aria-hidden="true"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="m6 9 6 6 6-6" />
      </svg>
    </div>
    <ul
      tabindex="0"
      class="dropdown-content menu z-10 mt-3 w-48 rounded-box bg-neutral p-2 text-neutral-content shadow [html[data-theme=black]_&]:shadow-white/20 [--menu-active-bg:var(--color-neutral-content)] [--menu-active-fg:var(--color-neutral)]"
    >
      <li v-for="language in languages" :key="language.locale">
        <button
          type="button"
          :lang="language.tag"
          :aria-current="language.current ? 'true' : undefined"
          @click="choose(language.locale)"
        >
          <span
            class="badge badge-sm badge-outline w-8 font-mono text-[.6rem] font-bold tracking-widest"
            >{{ language.locale.toUpperCase() }}</span
          >
          <span>{{ language.name }}</span>
        </button>
      </li>
    </ul>
  </div>
</template>

<style scoped></style>
