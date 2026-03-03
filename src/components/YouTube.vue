<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    videoId: string
    title?: string
    maxWidth?: number
  }>(),
  { maxWidth: 1024 },
)

const height = computed(() => Math.round((props.maxWidth * 9) / 16))
</script>

<template>
  <div class="mx-auto aspect-video w-full rounded-lg bg-neutral ring-1 ring-base-content/10" :style="{ maxWidth: `${props.maxWidth}px` }">
    <iframe
      :width="props.maxWidth"
      :height="height"
      class="h-full w-full rounded-lg"
      :src="`https://www.youtube.com/embed/${videoId}`"
      :title="props.title ?? 'YouTube video player'"
      allow="
        accelerometer;
        autoplay;
        clipboard-write;
        encrypted-media;
        gyroscope;
        picture-in-picture;
        web-share;
      "
      referrerpolicy="strict-origin-when-cross-origin"
      allowfullscreen
    ></iframe>
  </div>
</template>
