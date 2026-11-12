<script setup lang="ts">
import Talk from '@/components/Talk.vue'
import AmDashMarkdown from '@/components/AmDashMarkdown.vue'
import type { Talk as TalkType } from '@/types'

// Matches a talk card in the grid on the Talks page (components/TalksContent.vue)
defineProps<{
  talk: TalkType
}>()
</script>

<template>
  <section class="mx-auto max-w-6xl px-6 py-6">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Talk :talk="talk">
        <AmDashMarkdown>{{ talk.body }}</AmDashMarkdown>
      </Talk>
    </div>
  </section>
</template>
