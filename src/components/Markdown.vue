<script setup lang="ts">
import { marked } from 'marked'
import { useSlots, computed } from 'vue'
import type { VNode } from 'vue'

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
const rendered = computed(() => marked(extractText(slots.default?.() ?? [])) as string)
</script>

<template>
  <div v-html="rendered" />
</template>