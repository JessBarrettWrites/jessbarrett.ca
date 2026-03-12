<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useHead } from '@unhead/vue'

import PageHeader from '@/components/PageHeader.vue'
import ProfileBlock from '@/components/ProfileBlock.vue'
import FooterQuote from '@/components/FooterQuote.vue'
import AmDashMarkdown from '@/components/AmDashMarkdown.vue'
import { AUTHOR_NAME } from '@/constants'
import { useAboutPage } from '@/content'
import Footer from '@/components/Footer.vue'
import { pageUrl } from '@/routes'

const route = useRoute()
const about = useAboutPage()

const description = about.subtitle ?? `About ${AUTHOR_NAME}.`
const metaDescription = `About — ${AUTHOR_NAME}`

useHead({
  title: 'About',
  meta: [
    { name: 'description', content: description },
    { property: 'og:title', content: metaDescription },
    { property: 'og:description', content: description },
    { property: 'og:image', content: pageUrl(about.imageSrc) },
  ],
  link: [{ rel: 'preload', href: about.imageSrc, as: 'image' }],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'AboutPage',
        name: metaDescription,
        url: pageUrl(route.path),
        mainEntity: {
          '@type': 'Person',
          name: AUTHOR_NAME,
          image: pageUrl(about.imageSrc),
          jobTitle: 'Author',
          description: 'Award-winning journalist and author of No Place Like Home.',
        },
      }),
    },
  ],
})
</script>

<template>
  <article>
    <PageHeader :title="about.title">
      <template #subtitle>{{ about.subtitle }}</template>
    </PageHeader>
    <ProfileBlock>
      <template #image>
        <img
          :src="about.imageSrc"
          :alt="about.imageAlt"
          width="300"
          height="450"
          class="w-full shadow-2xl ring-1 ring-black/10"
        />
      </template>

      <AmDashMarkdown
        class="[&_p]:text-lg [&_p]:leading-relaxed [&_p]:opacity-90 [&_p+p]:mt-5 [&_a]:underline [&_a]:underline-offset-2"
        >{{ about.body }}</AmDashMarkdown
      >
    </ProfileBlock>

    <FooterQuote v-if="about.pullQuote">
      {{ about.pullQuote }}
    </FooterQuote>
    <Footer v-else />
  </article>
</template>

<style scoped></style>
