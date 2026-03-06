<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { AMDASH_FONTS } from '@/constants.ts'

const root = ref<HTMLElement>()
const useAmDash = ref(false)

onMounted(async () => {
  if (!root.value) {
    // EARLY EXIT: Element may not be present if conditionally mounted (v-if) or rapidly unmounted
    return
  }
  if (!document || !document.fonts) {
    // EARLY EXIT: Require document and document.fonts to properly determine style
    return
  }
  await document.fonts?.ready
  const fontFamily = getComputedStyle(root.value).fontFamily
  useAmDash.value = AMDASH_FONTS.some((f) => fontFamily.includes(f))
})
</script>

<template>
  <span ref="root">
    <template v-if="useAmDash">
      <span aria-hidden="true">am-</span><span class="sr-only">&mdash;</span>
    </template>
    <template v-else>&mdash;</template>
  </span>
</template>
