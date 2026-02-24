<script setup lang="ts">
import PageHeader from '@/components/PageHeader.vue'
import ProfileBlock from '@/components/ProfileBlock.vue'
import PullQuote from '@/components/PullQuote.vue'
</script>

<template>
  <article>
    <PageHeader title="About" subtitle="Author, Writer, and Award-Winning Journalist" />

    <ProfileBlock>
      <template #image>
        <div class="bg-base-200 aspect-3/4 w-full" role="img" aria-label="Author portrait"></div>
      </template>

      <h2 class="font-serif text-4xl font-bold">Jessica Barrett</h2>
      <p class="text-lg leading-relaxed opacity-90">
        Jessica Barrett is an award-winning journalist and writer. She has reported for the
        <span class="italic">Vancouver Sun</span>,
        <span class="italic font-semibold">BC Business</span> magazine, CBC
        <span class="italic">Avenue</span> magazine, and was senior editor of
        <span class="italic font-semibold">Vancouver</span> magazine. Jessica is a recipient of
        Postmedia's prestigious Michelle Lang Fellowship as well as the Jack Webster Foundation's
        City Mic award, among other accolades.
      </p>
      <p class="leading-relaxed opacity-75">
        After living in Vancouver for her entire adult life, Jessica Barrett packed up her entire
        apartment, quit her dream job as a magazine editor and headed for Calgary in search of an
        affordable place to call home. In the years since Barrett was priced out of Vancouver, the
        issue of housing affordability has become a national crisis, fanning the flames of social
        inequality and setting us up for financial ruin. But our obsession with rising housing
        prices obscures a more complex and pressing issue: we have lost our reverence for, and our
        understanding of, home.
      </p>
      <p class="leading-relaxed opacity-75">
        In <span class="italic font-semibold">No Place Like Home</span>, Barrett dives behind the
        headlines and statistics of Canada's housing crisis to examine how it has eaten away at our
        psyches by undermining our human needs for belonging, connection and stability. Through a
        mix of powerful memoir and rigorous journalism, she delivers an eye-opening portrait of our
        housing system while scouring the world for examples of how we might do things differently,
        pulling inspiration from the slum communities of Harare, Zimbabwe, the stately streets of
        Vienna, Austria, and the Cold-war era apartment blocks of West Berlin. In the process,
        Barrett forms a framework for solutions and the basis for achievable change.
      </p>
    </ProfileBlock>

    <div class="divider mx-auto max-w-4xl px-6 opacity-30"></div>

    <PullQuote>
      "We cannot solve our housing crisis until we first address our crisis of home. "
    </PullQuote>
  </article>
</template>

<style scoped></style>
