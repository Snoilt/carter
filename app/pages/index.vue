<script setup lang="ts">
import { ref } from "vue"
import { useHead } from "#imports"

import DotGridBg from "../../src/component/DotGrid/DotGrid.vue"
import SplitText from "../../src/component/SplitText/SplitText.vue"


const openFaq = ref<number | null>(null)
const toggleFaq = (index: number) => {
  openFaq.value = openFaq.value === index ? null : index
}

const faqItems = [
  { q: "Ist Kardr kostenlos?", a: "Ja, die Basisfunktionen sind komplett kostenlos nutzbar." },
  { q: "Kann ich Decks teilen?", a: "Ja — einfach Link kopieren oder Freund:innen einladen." },
  { q: "Wie funktionieren Duelle?", a: "Beide spielen die gleichen Karten – wer schneller richtig liegt, gewinnt." },
  { q: "Brauche ich eine App?", a: "Nein! Kardr läuft direkt im Browser, mobil & Desktop." }
]

const team = [
  { name: "Emilio Dagn", role: "Frontend Developer", avatar: "https://static.licdn.com/aero-v1/sc/h/9c8pery4andzj6ohjkjp54ma2",link: "https://linkedin.com/in/emiliodagn" },
  { name: "Paul Oellers", role: "UI/UX Designerin", avatar: "https://static.licdn.com/aero-v1/sc/h/9c8pery4andzj6ohjkjp54ma2",link: "https://linkedin.com/in/pauloellers" },
  { name: "Nadine Evin", role: "Backend Engineer", avatar: "https://media.licdn.com/dms/image/v2/D4E03AQHqW_NrE6V0Zw/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1698499301329?e=2147483647&v=beta&t=VTZqM1pbDIMPDzXM0LCGERsFqTSoY2VAZRYWQspo7d8",link: "https://de.linkedin.com/in/nadine-evin-5314b2298" },
  { name: "Robert Hegerath", role: "Backend Engineer", avatar: "https://static.licdn.com/aero-v1/sc/h/9c8pery4andzj6ohjkjp54ma2",link: "https://linkedin.com/in/roberthegerath" }
]

useHead({
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
  <div class="relative isolate min-h-[100svh] overflow-hidden bg-randoblue-950 text-purpleish-50">
    <!-- BACKGROUND (vue-bits) -->
    <DotGridBg class="pointer-events-none absolute inset-0 z-0 opacity-35" />
    <div class="pointer-events-none absolute inset-0 z-0 bg-gradient-to-b from-black/15 via-black/45 to-black/70" />
    <div
      class="pointer-events-none absolute inset-0 z-0 [background:radial-gradient(circle_at_20%_10%,rgba(236,104,190,0.18),transparent_55%),radial-gradient(circle_at_80%_20%,rgba(95,125,255,0.18),transparent_55%)]"
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
                class-name="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs text-purpleish-50 ring-1 ring-white/10"
              />

              <div class="mt-6">
                <SplitText
                  text="Mach aus Karteikarten ein Game."
                  split-type="words"
                  class-name="text-balance text-4xl font-extrabold leading-tight tracking-tight md:text-6xl"
                />
              </div>

              <p class="mt-4 max-w-2xl text-base leading-relaxed text-purpleish-100/80 md:text-lg">
                Kardr ist Karteikarten-Lernen — aber mit Motivation:
                Du trittst gegen Mitschüler:innen & Kommiliton:innen an, sammelst XP
                und siehst deinen Fortschritt sofort.
              </p>

              <div class="mt-6 flex flex-wrap items-center gap-2 text-sm text-purpleish-100/80">
                <span class="rounded-full bg-white/5 px-3 py-1 ring-1 ring-white/10">⚔️ 1v1 Duelle</span>
                <span class="rounded-full bg-white/5 px-3 py-1 ring-1 ring-white/10">🧠 Decks teilen</span>
                <span class="rounded-full bg-white/5 px-3 py-1 ring-1 ring-white/10">🔥 Streaks</span>
                <span class="rounded-full bg-white/5 px-3 py-1 ring-1 ring-white/10">🏆 Rangliste</span>
              </div>

              <div class="mt-8 flex flex-col gap-3 sm:flex-row">
                <NuxtLink to="/auth/register" class="w-full sm:w-auto">
                  <UButton size="lg" class="w-full bg-dollepink-500 hover:bg-dollepink-400 text-white">
                    Kostenlos starten
                  </UButton>
                </NuxtLink>
                <a href="#features" class="w-full sm:w-auto">
                  <UButton
                    size="lg"
                    variant="outline"
                    class="w-full border-white/15 text-purpleish-50 hover:bg-white/5"
                  >
                    Mehr erfahren
                  </UButton>
                </a>
              </div>
            </div>
          </div>

          <div class="mt-12 border-t border-white/10" />
        </section>

        <!-- FEATURES -->
        <section id="features" class="pt-14">
          <div class="grid gap-10 md:grid-cols-12">
            <div class="md:col-span-5">
              <h2 class="text-2xl font-bold tracking-tight md:text-3xl">Warum Kardr?</h2>
              <p class="mt-3 text-purpleish-100/80">
                Du bekommst den Effekt von Flashcards — aber mit dem Sog eines Spiels.
              </p>

              <div class="mt-6 space-y-3">
                <div class="flex items-start gap-3 rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
                  <div class="mt-0.5 h-8 w-8 rounded-xl bg-dollepink-500/20 ring-1 ring-dollepink-500/30" />
                  <div>
                    <div class="font-semibold">Schnellstart</div>
                    <div class="text-sm text-purpleish-100/80">Match oder Session in Sekunden.</div>
                  </div>
                </div>

                <div class="flex items-start gap-3 rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
                  <div class="mt-0.5 h-8 w-8 rounded-xl bg-purpleish-500/20 ring-1 ring-purpleish-500/30" />
                  <div>
                    <div class="font-semibold">Teilen & Lernen</div>
                    <div class="text-sm text-purpleish-100/80">Decks für Kurse & Gruppen.</div>
                  </div>
                </div>

                <div class="flex items-start gap-3 rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
                  <div class="mt-0.5 h-8 w-8 rounded-xl bg-randoblue-400/20 ring-1 ring-randoblue-400/30" />
                  <div>
                    <div class="font-semibold">Motivation</div>
                    <div class="text-sm text-purpleish-100/80">Streaks, XP & Rankings halten dich dran.</div>
                  </div>
                </div>
              </div>
            </div>

            <div class="md:col-span-7">
              <div class="grid gap-4 md:grid-cols-2">
                <UCard class="bg-white/5 ring-1 ring-white/10 rounded-3xl" variant="subtle">
                  <div class="p-1">
                    <div class="text-sm text-purpleish-100/80">⚔️ Duelle</div>
                    <div class="mt-1 text-lg font-semibold">Kurz, schnell, kompetitiv</div>
                    <p class="mt-2 text-sm text-purpleish-100/70">Fair & fordernd — korrekt + schnell = Win.</p>
                  </div>
                </UCard>

                <UCard class="bg-white/5 ring-1 ring-white/10 rounded-3xl" variant="subtle">
                  <div class="p-1">
                    <div class="text-sm text-purpleish-100/80">🧩 Deck Builder</div>
                    <div class="mt-1 text-lg font-semibold">Erstellen in Minuten</div>
                    <p class="mt-2 text-sm text-purpleish-100/70">Begriffe rein, direkt spielen.</p>
                  </div>
                </UCard>
              </div>
            </div>
          </div>

          <div class="mt-14 border-t border-white/10" />
        </section>

        <!-- FAQ -->
        <section id="faq" class="pt-14">
          <h2 class="text-2xl font-bold tracking-tight md:text-3xl">FAQ</h2>

          <!-- Animated FAQ -->
          <div class="mt-8 space-y-3">
            <div
              v-for="(item, i) in faqItems"
              :key="i"
              class="rounded-2xl bg-white/5 ring-1 ring-white/10 overflow-hidden"
            >
              <button
                class="flex w-full items-center justify-between px-5 py-4 text-left text-purpleish-50 font-semibold"
                @click="toggleFaq(i)"
              >
                <span>{{ item.q }}</span>
                <span class="text-xl">{{ openFaq === i ? "−" : "+" }}</span>
              </button>
              <transition
                enter-active-class="transition-all duration-300 ease-out"
                leave-active-class="transition-all duration-200 ease-in"
              >
                <div v-if="openFaq === i" class="px-5 pb-5 text-sm text-purpleish-100/80">
                  {{ item.a }}
                </div>
              </transition>
            </div>
          </div>
        </section>

        <!-- TEAM SECTION -->
        <section id="team" class="relative pt-20">
          
          <div class="relative z-10">
            <h2 class="text-2xl font-bold tracking-tight md:text-3xl">Unser Team</h2>
            <div class="mt-8 grid gap-6 md:grid-cols-3">
              <div
                v-for="member in team"
                :key="member.name"
                class="rounded-2xl bg-white/5 ring-1 ring-white/10 p-6 text-center backdrop-blur-sm"
              >
			  <a
				:href="member.link"
				target="_blank"
				rel="noopener noreferrer"
				class="inline-block"
			>
                <img
                  :src="member.avatar"
                  class="mx-auto h-20 w-20 rounded-full border-2 border-dollepink-400 object-cover"
                  :alt="member.name"
                />
			  </a>
                <div class="mt-3 text-lg font-semibold">{{ member.name }}</div>
                <div class="text-sm text-purpleish-100/80">{{ member.role }}</div>
              </div>
            </div>
          </div>
        </section>

        <!-- FOOTER -->
        <footer class="mt-16 border-t border-white/10 py-10 text-sm text-purpleish-100/70">
          <div class="flex flex-col justify-between gap-3 md:flex-row">
            <span>© {{ new Date().getFullYear() }} Kardr</span>
            <div class="flex gap-4">
              <NuxtLink to="/impressum" class="hover:text-white">Impressum</NuxtLink>
              <NuxtLink to="/datenschutz" class="hover:text-white">Datenschutz</NuxtLink>
            </div>
          </div>
        </footer>
      </main>
    </MaxContainer>
  </div>
</template>


