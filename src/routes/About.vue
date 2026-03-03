<script setup lang="ts">
import { useHead } from '@unhead/vue'
import PageHeader from '@/components/PageHeader.vue'
import ProfileBlock from '@/components/ProfileBlock.vue'
import FooterQuote from '@/components/FooterQuote.vue'
import Markdown from '@/components/Markdown.vue'
import { parseAbout } from '@/content'
import Footer from '@/components/Footer.vue'

const { meta, body } = parseAbout()

useHead({
  title: 'About',
  meta: [{ name: 'description', content: meta.subtitle ?? 'About Jessica Barrett.' }],
  link: [{ rel: 'preload', href: meta.imageSrc, as: 'image' }],
})
</script>

<template>
  <article>
    <PageHeader :title="meta.title">
      <template #subtitle>{{ meta.subtitle }}</template>
    </PageHeader>
    <ProfileBlock>
      <template #image>
        <img
          :src="meta.imageSrc"
          :alt="meta.imageAlt"
          width="300"
          height="450"
          class="w-full shadow-2xl ring-1 ring-black/10"
        />
      </template>

      <Markdown
        class="[&_p]:text-lg [&_p]:leading-relaxed [&_p]:opacity-90 [&_p+p]:mt-5 [&_a]:underline [&_a]:underline-offset-2"
        >{{ body }}</Markdown
      >
    </ProfileBlock>

    <FooterQuote v-if="meta.pullQuote">
      {{ meta.pullQuote }}
    </FooterQuote>
    <Footer v-else />
  </article>
</template>

<style scoped></style>
