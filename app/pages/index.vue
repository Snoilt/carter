<script setup lang="ts">
import { definePageMeta } from "#imports";



definePageMeta({
  title: "Kardr — Flashcards als Duell",
  meta: [
    {
      name: "description",
      content:
        "Kardr macht Karteikarten-Lernen motivierend: Duelle, Decks teilen, Streaks und Team-Features mit Gamification."
    }
  ]
})
</script>


<template>
  <div class="relative isolate min-h-[100svh] overflow-hidden bg-white text-black dark:bg-randoblue-950 dark:text-purpleish-50">
    <!-- BACKGROUND (vue-bits) -->
    <HomeBackground/>

    <MaxContainer class="relative z-10">
      <main class="pb-16">
        <!-- HERO -->
        <HomeHero class="mt-14" />

        <!-- FEATURES -->
        <HomeFeatures class="mt-14" />

        <HomeFaq class="mt-14" />
        <HomeTeam class="mt-14" />
        <HomeFooter class="mt-14" />
        
      </main>
    </MaxContainer>
  </div>
</template>


