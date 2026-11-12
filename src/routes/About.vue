<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useHead } from '@unhead/vue'

import AboutContent from '@/components/AboutContent.vue'
import { AUTHOR_NAME } from '@/constants'
import { useAboutPage } from '@/content'
import { LOCALE_TAGS, useLocale } from '@/locale'
import { useMessages } from '@/messages'
import { pageUrl } from '@/routes'

const route = useRoute()
const locale = useLocale()
const messages = useMessages()
const about = useAboutPage(locale.value)

const title = messages.value.about.title
const description = about.subtitle ?? messages.value.about.description
const metaDescription = `${title} — ${AUTHOR_NAME}`

useHead({
  title,
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
        inLanguage: LOCALE_TAGS[locale.value],
        mainEntity: {
          '@type': 'Person',
          name: AUTHOR_NAME,
          image: pageUrl(about.imageSrc),
          jobTitle: messages.value.about.jobTitle,
          description: messages.value.about.personDescription,
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
