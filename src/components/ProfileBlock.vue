<script setup lang="ts">
defineProps<{ reverse?: boolean; id?: string }>()
</script>

<template>
  <section :id="id" class="mx-auto max-w-4xl px-6 py-9 sm:py-18">
    <div
      :class="['grid gap-12 md:items-start', reverse ? 'md:grid-cols-[8fr_5fr]' : 'md:grid-cols-[5fr_8fr]']"
    >
      <div :class="['max-w-[200px] mx-auto md:max-w-none', { 'md:order-last': reverse }]">
        <slot name="image" />
      </div>
      <div class="flex flex-col gap-5">
        <slot />
      </div>
    </div>
  </section>
</template>

<style scoped></style>