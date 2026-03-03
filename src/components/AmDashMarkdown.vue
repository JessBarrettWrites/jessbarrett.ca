<script setup lang="ts">
import { marked } from 'marked'
import { ref, useSlots, computed, onMounted } from 'vue'
import type { VNode } from 'vue'
import { AMDASH_FONTS, AMDASH_HTML, EMDASH_RE } from '@/constants.ts'

function extractText(vnodes: VNode[]): string {
  return vnodes
    .map((vnode) => {
      if (typeof vnode.children === 'string') return vnode.children
      if (Array.isArray(vnode.children)) return extractText(vnode.children as VNode[])
      return ''
    })
    .join('')
}

const slots = useSlots()
const root = ref<HTMLElement>()
const useAmDash = ref(false)

onMounted(async () => {
  if (!root.value) return
  await document.fonts?.ready
  const fontFamily = getComputedStyle(root.value).fontFamily
  useAmDash.value = AMDASH_FONTS.some((f) => fontFamily.includes(f))
})

const rendered = computed(() => {
  const html = marked(extractText(slots.default?.() ?? [])) as string
  return useAmDash.value ? html.replace(EMDASH_RE, AMDASH_HTML) : html
})
</script>

<template>
  <div ref="root" v-html="rendered" />
</template>
