<script setup lang="ts">
import { ref, computed, toRef, toValue, onMounted } from 'vue'
import AmDashMarkdown from '@/components/AmDashMarkdown.vue'
import ProfileBlock from '@/components/ProfileBlock.vue'
import { useMessages } from '@/messages'
import { pagePath } from '@/routes'
import type { Book } from '@/types'

const props = withDefaults(
  defineProps<{
    book: Book
    titleLink?: boolean
    linkText?: string
    reverse?: boolean
    expanded?: boolean
  }>(),
  { expanded: false },
)

const book = toRef(props, 'book')
const messages = useMessages()

const today = new Date()

const isFeatured = computed(() => {
  const { featuredUntil } = toValue(book)
  return !!featuredUntil && today <= featuredUntil
})

const statusText = computed(() => {
  const { available, preorder } = toValue(book)
  if (available && today >= available) return messages.value.book.availableNow
  if (preorder && today >= preorder) return messages.value.book.preorder
  return null
})

const CLAMP_HEIGHT = 150

const isExpanded = ref(props.expanded)
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
  if (!toValue(isExpanded) && bodyEl) {
    expandedHeight.value = bodyEl.scrollHeight
  }
  isExpanded.value = !toValue(isExpanded)
}

const bodyStyle = computed(() => {
  // DEV NOTE: Starting expanded, nothing has been measured yet, so don't limit the height (which
  //           also lets the description grow while it's edited in the CMS preview)
  if (toValue(isExpanded) && !toValue(expandedHeight)) return {}
  return {
    maxHeight: `${toValue(isExpanded) ? toValue(expandedHeight) : toValue(clampHeight)}px`,
  }
})
</script>

<template>
  <ProfileBlock :reverse="reverse" :id="book.slug">
    <template #image>
      <img
        v-if="book.imageSrc"
        :src="book.imageSrc"
        :alt="book.imageAlt"
        width="300"
        height="450"
        :style="{ maxHeight: `450px` }"
        class="shadow-2xl ring-1 ring-black/10"
      />
    </template>

    <p v-if="isFeatured" class="font-serif text-sm uppercase tracking-widest opacity-50">
      {{ messages.book.featured }}
    </p>
    <h2 class="font-serif text-4xl font-bold leading-tight">
      <RouterLink
        v-if="titleLink && book.slug"
        :to="`${pagePath('books')}#${book.slug}`"
        class="hover:underline underline-offset-4"
        >{{ book.title }}</RouterLink
      >
      <template v-else>{{ book.title }}</template>
    </h2>
    <p v-if="book.subtitle" class="font-serif text-lg italic opacity-60 leading-tight -mt-3">
      {{ book.subtitle }}
    </p>
    <ul v-if="book.accolades?.length" class="flex flex-col gap-1">
      <li v-for="accolade in book.accolades" :key="accolade.text">
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
        :href="book.url"
        target="_blank"
        rel="noopener noreferrer"
        class="btn btn-neutral transition-all hover:translate-y-0.5 hover:shadow-inner active:translate-y-1"
      >
        {{ linkText ?? messages.book.getTheBook }}
      </a>
    </div>

    <p v-if="book.synopsis" class="font-serif font-bold font-italic opacity-70 leading-relaxed">
      <AmDashMarkdown>{{ book.synopsis }}</AmDashMarkdown>
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
        v-if="overflows && !isExpanded"
        class="absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-base-100 to-transparent pointer-events-none"
      />
    </div>

    <button
      v-if="overflows"
      @click="toggle"
      :aria-expanded="isExpanded"
      class="btn btn-ghost btn-md font-serif italic opacity-50 hover:opacity-100"
    >
      {{ isExpanded ? messages.showLess : messages.readMore }}
    </button>
  </ProfileBlock>
</template>

<style scoped></style>
