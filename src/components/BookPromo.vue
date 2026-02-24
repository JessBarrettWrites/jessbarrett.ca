<script setup lang="ts">
import ProfileBlock from '@/components/ProfileBlock.vue'

defineProps<{
  label?: string
  title: string
  subtitle?: string
  imageSrc: string
  imageAlt: string
  href: string
  linkText?: string
  reverse?: boolean
}>()
</script>

<template>
  <ProfileBlock :reverse="reverse">
    <template #image>
      <img :src="imageSrc" :alt="imageAlt" class="w-full shadow-2xl ring-1 ring-black/10" />
    </template>

    <p v-if="label" class="font-serif text-sm uppercase tracking-widest opacity-50">{{ label }}</p>
    <h2 class="font-serif text-4xl font-bold leading-tight">{{ title }}</h2>
    <p v-if="subtitle" class="font-serif text-lg italic opacity-60">{{ subtitle }}</p>

    <slot />

    <div class="md:hidden">
      <a
        :href="href"
        target="_blank"
        class="btn btn-neutral transition-all hover:translate-y-0.5 hover:shadow-inner active:translate-y-1"
      >
        {{ linkText ?? 'Get the Book' }}
      </a>
    </div>
    <div class="hidden md:block">
      <a
        :href="href"
        target="_blank"
        class="btn btn-neutral transition-all hover:translate-y-0.5 hover:shadow-inner active:translate-y-1"
      >
        {{ linkText ?? 'Get the Book' }}
      </a>
    </div>
  </ProfileBlock>
</template>

<style scoped></style>
