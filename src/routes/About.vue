<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useHead } from '@unhead/vue'

import AboutContent from '@/components/AboutContent.vue'
import { AUTHOR_NAME } from '@/constants'
import { useAboutPage } from '@/content'
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
  <AboutContent :about="about" />
</template>

<style scoped></style>
