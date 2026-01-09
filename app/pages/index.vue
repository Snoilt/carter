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
    <DotGrid class="pointer-events-none absolute inset-0 z-0 opacity-35" />
    <div class="pointer-events-none absolute inset-0 z-0 dark:bg-gradient-to-b dark:from-black/15 dark:via-black/45 dark:to-black/70" />
    <div
      class="pointer-events-none absolute inset-0 z-0 [background:radial-gradient(circle_at_0%_100%,rgba(95,125,255,0.25),transparent_55%),radial-gradient(circle_at_100%_0%,rgba(95,125,255,0.25),transparent_55%)] dark:[background:radial-gradient(circle_at_0%_100%,rgba(147,51,234,0.35),transparent_55%),radial-gradient(circle_at_100%_0%,rgba(168,85,247,0.25),transparent_55%)]"
    />

    <MaxContainer class="relative z-10">
      <main class="pb-16">
        <!-- HERO -->
        <section class="pt-10 md:pt-14">
          <div class="grid items-center gap-10 md:grid-cols-12">
            <div class="md:col-span-12 min-w-0">
              <UtilsShinyText
                text="Schnell lernen • Gegeneinander spielen • Dranbleiben"
                :disabled="false"
                :speed="3"
                class-name="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs text-black dark:text-purpleish-50 ring-1 ring-gray-400 dark:ring-white/10"
              />

              <div class="mt-6">
                <UtilsSplitText
                  text="Mach aus Karteikarten ein Game."
                  split-type="words"
                  class-name="text-balance text-4xl font-extrabold leading-tight tracking-tight md:text-6xl text-black dark:text-purpleish-50"
                />
              </div>

              <p class="mt-4 max-w-2xl text-base leading-relaxed text-gray-700 dark:text-purpleish-100/80 md:text-lg">
                Kardr ist Karteikarten-Lernen – aber motivierend:
                Tritt gegen Mitschüler:innen und Kommiliton:innen an, sammle XP
                und verfolge deinen Fortschritt in Echtzeit.
              </p>

              <div class="mt-6 flex flex-wrap items-center gap-2 text-sm text-gray-700 dark:text-purpleish-100/80">
                <span class="rounded-full bg-white/5 px-3 py-1 ring-1 ring-gray-400 dark:ring-white/10">⚔️ 1v1 Duelle</span>
                <span class="rounded-full bg-white/5 px-3 py-1 ring-1 ring-gray-400 dark:ring-white/10">🧠 Decks teilen</span>
                <span class="rounded-full bg-white/5 px-3 py-1 ring-1 ring-gray-400 dark:ring-white/10">🔥 Streaks</span>
                <span class="rounded-full bg-white/5 px-3 py-1 ring-1 ring-gray-400 dark:ring-white/10">🏆 Rangliste</span>
              </div>

              <div class="mt-8 flex flex-col gap-3 sm:flex-row">
                <NuxtLink to="/auth/register" class="w-full sm:w-auto">
                  <UButton size="lg" class="w-full bg-blue-400 hover:bg-blue-500 text-white dark:bg-dollepink-500 dark:hover:bg-dollepink-400">
                    Kostenlos starten
                  </UButton>
                </NuxtLink>
                <a href="#features" class="w-full sm:w-auto">
                  <UButton
                    size="lg"
                    variant="outline"
                    class="w-full border-blue-400 dark:border-white/15 text-black dark:text-purpleish-50 hover:bg-blue-50 dark:hover:bg-white/5"
                  >
                    Mehr erfahren
                  </UButton>
                </a>
              </div>
            </div>
          </div>

          <div class="mt-12 border-t border-gray-200 dark:border-white/10" />
        </section>

        <!-- FEATURES -->
        <HomeFeatures class="mt-14" />

        <HomeFaq class="mt-14" />
        <HomeTeam class="mt-14" />
        <HomeFooter class="mt-14" />
        
      </main>
    </MaxContainer>
  </div>
</template>


