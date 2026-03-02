<script setup lang="ts">
import PageHeader from '@/components/PageHeader.vue'
import ProfileBlock from '@/components/ProfileBlock.vue'
import PullQuote from '@/components/PullQuote.vue'
import Markdown from '@/components/Markdown.vue'
import { parseAbout } from '@/content'

const { meta, body } = parseAbout()
</script>

<template>
  <article>
    <PageHeader :title="meta.title" :subtitle="meta.subtitle" />
    <ProfileBlock>
      <template #image>
        <img
          :src="meta.imageSrc"
          :alt="meta.imageAlt"
          class="w-full shadow-2xl ring-1 ring-black/10"
        />
      </template>

      <Markdown class="[&_p]:text-lg [&_p]:leading-relaxed [&_p]:opacity-90 [&_p+p]:mt-5">{{
        body
      }}</Markdown>
    </ProfileBlock>

    <PullQuote v-if="meta.pullQuote">{{ meta.pullQuote }}</PullQuote>
  </article>
</template>

<style scoped></style>
