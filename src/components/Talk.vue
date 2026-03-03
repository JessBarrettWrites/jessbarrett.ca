<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import Markdown from '@/components/Markdown.vue'

defineProps<{
  title: string
  body: string
}>()

const COLLAPSED_HEIGHT = 200

const expanded = ref(false)
const bodyElement = ref<HTMLDivElement | null>(null)
const overflows = ref(false)
const expandedHeight = ref(0)

onMounted(() => {
  if (bodyElement.value) {
    overflows.value = bodyElement.value.scrollHeight > COLLAPSED_HEIGHT
  }
})

function toggle() {
  if (!expanded.value && bodyElement.value) {
    expandedHeight.value = bodyElement.value.scrollHeight
  }
  expanded.value = !expanded.value
}

const bodyStyle = computed(() => ({
  maxHeight: `${expanded.value ? expandedHeight.value : COLLAPSED_HEIGHT}px`,
}))
</script>

<template>
  <div class="card shadow-sm border border-neutral">
    <div class="bg-neutral text-neutral-content px-6 py-4 rounded-t-[inherit]">
      <h3 class="font-serif text-xl font-bold">{{ title }}</h3>
    </div>
    <div class="card-body">
      <div class="relative">
        <div
          ref="bodyElement"
          :style="bodyStyle"
          class="overflow-hidden transition-[max-height] duration-500 ease-in-out"
        >
          <Markdown
            class="text-sm leading-relaxed opacity-90 [&_a]:underline [&_a]:underline-offset-2"
            >{{ body }}</Markdown
          >
        </div>
        <div
          v-if="overflows && !expanded"
          class="absolute inset-x-0 bottom-0 h-12 bg-linear-to-t from-base-100 to-transparent pointer-events-none"
        />
      </div>
      <div v-if="overflows" class="card-actions justify-center">
        <button
          @click="toggle"
          :aria-expanded="expanded"
          class="btn btn-ghost btn-md font-serif italic opacity-70 hover:opacity-100"
        >
          {{ expanded ? 'Show less' : 'Read more' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
