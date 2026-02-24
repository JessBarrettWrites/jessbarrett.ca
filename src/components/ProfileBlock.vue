<script setup lang="ts"></script>

<template>
  <section class="mx-auto max-w-4xl px-6 py-9 sm:py-18">
    <div class="grid gap-12 md:grid-cols-[5fr_8fr] md:items-start">
      <slot name="image" />
      <div class="flex flex-col gap-5">
        <slot />
      </div>
    </div>
  </section>
</template>

<style scoped></style>
