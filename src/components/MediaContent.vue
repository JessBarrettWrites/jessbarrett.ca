<script setup lang="ts">
import { computed } from 'vue'

import MediaAppearance from '@/components/MediaAppearance.vue'
import PageHeader from '@/components/PageHeader.vue'
import Footer from '@/components/Footer.vue'
import { useMessages } from '@/messages'
import { appearanceDateSort } from '@/presentation'
import type { MediaPage } from '@/types'

const props = defineProps<{
  page: MediaPage
}>()

const messages = useMessages()
const appearances = computed(() => [...props.page.appearances].sort(appearanceDateSort))
</script>

<template>
  <article>
    <PageHeader :title="messages.media.title">
      <template v-if="page.description" #subtitle>{{ page.description }}</template>
    </PageHeader>

    <section class="mx-auto w-full max-w-4xl px-6 py-6 pb-6">
      <div v-if="appearances.length === 0" class="py-12 text-center opacity-50 font-serif italic">
        {{ messages.media.comingSoon }}
      </div>
      <ul v-else class="flex flex-col">
        <li v-for="(appearance, i) in appearances" :key="appearance.url">
          <hr v-if="i > 0" class="my-4 border-base-content/10" />
          <MediaAppearance :appearance="appearance" />
        </li>
      </ul>
    </section>

    <Footer />
  </article>
</template>

<style scoped></style>
