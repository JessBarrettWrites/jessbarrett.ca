<script setup lang="ts">
import { ref, computed, toRef, toValue, onMounted } from 'vue'
import Markdown from '@/components/Markdown.vue'
import ProfileBlock from '@/components/ProfileBlock.vue'
import type { Book } from '@/types'

const props = defineProps<{
  book: Book
  titleLink?: boolean
  linkText?: string
  reverse?: boolean
}>()

const book = toRef(props, 'book')

const today = new Date()

const isFeatured = computed(() => {
  const { featuredUntil } = toValue(book).meta
  return !!featuredUntil && today <= featuredUntil
})

const statusText = computed(() => {
  const { available, preorder } = toValue(book).meta
  if (available && today >= available) return 'Available Now'
  if (preorder && today >= preorder) return 'Available for Pre-Order'
  return null
})

const CLAMP_HEIGHT = 150

const expanded = ref(false)
const bodyElement = ref<HTMLDivElement | null>(null)
const clampHeight = ref(CLAMP_HEIGHT)
const overflows = ref(false)
const expandedHeight = ref(0)

onMounted(() => {
  const el = toValue(bodyElement)
  if (el && el.scrollHeight > CLAMP_HEIGHT) {
    overflows.value = true
  }
})

function toggle() {
  const bodyEl = toValue(bodyElement)
  if (!toValue(expanded) && bodyEl) {
    expandedHeight.value = bodyEl.scrollHeight
  }
  expanded.value = !toValue(expanded)
}

const bodyStyle = computed(() => ({
  maxHeight: `${toValue(expanded) ? toValue(expandedHeight) : toValue(clampHeight)}px`,
}))
</script>

<template>
  <ProfileBlock :reverse="reverse" :id="book.slug">
    <template #image>
      <img
        :src="book.meta.imageSrc"
        :alt="book.meta.imageAlt"
        width="300"
        height="450"
        :style="{ maxHeight: `450px` }"
        class="shadow-2xl ring-1 ring-black/10"
      />
    </template>

    <p v-if="isFeatured" class="font-serif text-sm uppercase tracking-widest opacity-50">
      Featured Book
    </p>
    <h2 class="font-serif text-4xl font-bold leading-tight">
      <RouterLink
        v-if="titleLink && book.slug"
        :to="`/books#${book.slug}`"
        class="hover:underline underline-offset-4"
        >{{ book.meta.title }}</RouterLink
      >
      <template v-else>{{ book.meta.title }}</template>
    </h2>
    <p v-if="book.meta.subtitle" class="font-serif text-lg italic opacity-60 leading-tight -mt-3">
      {{ book.meta.subtitle }}
    </p>
    <ul v-if="book.meta.accolades?.length" class="flex flex-col gap-1">
      <li v-for="accolade in book.meta.accolades" :key="accolade.text">
        <a
          :href="accolade.url"
          target="_blank"
          rel="noopener noreferrer"
          class="font-serif text-sm italic opacity-60 hover:opacity-100 transition-opacity underline underline-offset-2"
          >{{ accolade.text }}</a
        >
      </li>
    </ul>
    <p v-if="statusText" class="font-serif font-bold text-md opacity-80">{{ statusText }}</p>

    <div>
      <a
        :href="book.meta.url"
        target="_blank"
        rel="noopener noreferrer"
        class="btn btn-neutral transition-all hover:translate-y-0.5 hover:shadow-inner active:translate-y-1"
      >
        {{ linkText ?? 'Get the Book' }}
      </a>
    </div>

    <p
      v-if="book.meta.synopsis"
      class="font-serif font-bold font-italic opacity-70 leading-relaxed"
    >
      <Markdown>{{ book.meta.synopsis }}</Markdown>
    </p>

    <div class="relative">
      <div
        ref="bodyElement"
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
      :aria-expanded="expanded"
      class="btn btn-ghost btn-md font-serif italic opacity-50 hover:opacity-100"
    >
      {{ expanded ? 'Show less' : 'Read more' }}
    </button>
  </ProfileBlock>
</template>

<style scoped></style>
