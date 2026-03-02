<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import ProfileBlock from '@/components/ProfileBlock.vue'

const props = defineProps<{
  featuredUntil?: Date
  title: string
  subtitle?: string
  imageSrc: string
  imageAlt: string
  url: string
  preorder?: Date
  available?: Date
  linkText?: string
  reverse?: boolean
  slug?: string
}>()

const today = new Date()

const isFeatured = computed(() => !!props.featuredUntil && today <= props.featuredUntil)

const statusText = computed(() => {
  if (props.available && today >= props.available) return 'Available Now'
  if (props.preorder && today >= props.preorder) return 'Available for Pre-Order'
  return null
})

const COLLAPSED_HEIGHT = 500

const expanded = ref(false)
const imageEl = ref<HTMLImageElement | null>(null)
const bodyEl = ref<HTMLDivElement | null>(null)
const clampHeight = ref(COLLAPSED_HEIGHT)
const overflows = ref(false)
const expandedHeight = ref(0)

function measure() {
  if (!imageEl.value || !bodyEl.value) return
  const imageBottom = imageEl.value.getBoundingClientRect().bottom
  const bodyTop = bodyEl.value.getBoundingClientRect().top
  const remaining = imageBottom - bodyTop
  clampHeight.value = remaining > 0 ? remaining : COLLAPSED_HEIGHT
  overflows.value = bodyEl.value.scrollHeight > clampHeight.value
}

onMounted(() => {
  if (imageEl.value?.complete) {
    measure()
  } else {
    imageEl.value?.addEventListener('load', measure)
  }
  window.addEventListener('resize', measure)
})

onUnmounted(() => {
  window.removeEventListener('resize', measure)
})

function toggle() {
  if (!expanded.value && bodyEl.value) {
    expandedHeight.value = bodyEl.value.scrollHeight
  }
  expanded.value = !expanded.value
}

const bodyStyle = computed(() => ({
  maxHeight: `${expanded.value ? expandedHeight.value : clampHeight.value}px`,
}))
</script>

<template>
  <ProfileBlock :reverse="reverse" :id="slug">
    <template #image>
      <img
        ref="imageEl"
        :src="imageSrc"
        :alt="imageAlt"
        :style="{ maxHeight: `${COLLAPSED_HEIGHT}px` }"
        class="shadow-2xl ring-1 ring-black/10"
      />
    </template>

    <p v-if="isFeatured" class="font-serif text-sm uppercase tracking-widest opacity-50">
      Featured Book
    </p>
    <h2 class="font-serif text-4xl font-bold leading-tight">{{ title }}</h2>
    <p v-if="subtitle" class="font-serif text-lg italic opacity-60 leading-tight -mt-3">
      {{ subtitle }}
    </p>
    <p v-if="statusText" class="font-serif font-bold text-md opacity-80">{{ statusText }}</p>

    <div>
      <a
        :href="url"
        target="_blank"
        class="btn btn-neutral transition-all hover:translate-y-0.5 hover:shadow-inner active:translate-y-1"
      >
        {{ linkText ?? 'Get the Book' }}
      </a>
    </div>

    <div class="relative">
      <div
        ref="bodyEl"
        :style="bodyStyle"
        class="overflow-hidden transition-[max-height] duration-500 ease-in-out"
      >
        <slot />
      </div>
      <div
        v-if="overflows && !expanded"
        class="absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-base-100 to-transparent pointer-events-none"
      />
    </div>

    <button
      v-if="overflows"
      @click="toggle"
      class="font-serif text-md italic opacity-50 hover:opacity-100 transition-opacity"
    >
      {{ expanded ? 'Show less' : 'Read more' }}
    </button>
  </ProfileBlock>
</template>

<style scoped></style>
