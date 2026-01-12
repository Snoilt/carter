<script setup lang="ts">
import { definePageMeta } from "#imports"

definePageMeta({
	title: "Impressum — Kardr",
	meta: [
		{
			name: "description",
			content: "Impressum und rechtliche Informationen zu Kardr",
		},
	],
})
</script>

<template>
	<div
		class="relative isolate min-h-svh overflow-hidden bg-white text-black dark:bg-randoblue-950 dark:text-purpleish-50"
	>
		<div
			class="pointer-events-none absolute inset-0 z-0 dark:bg-linear-to-b dark:from-black/15 dark:via-black/45 dark:to-black/70"
		/>

		<MaxContainer class="relative z-10">
			<main class="py-16">
				<section class="pt-10 md:pt-14">
					<div class="max-w-3xl">
						<h1
							class="text-4xl font-bold tracking-tight md:text-5xl text-black dark:text-purpleish-50 mb-8"
						>
							Impressum
						</h1>

						<div class="space-y-8 text-gray-700 dark:text-purpleish-100/80">
							<div>
								<h2 class="text-2xl font-semibold text-black dark:text-purpleish-50 mb-3">
									Angaben gemäß § 5 TMG
								</h2>
								<p>
									Kardr — Flashcards als Duell<br />
									Deine Adresse<br />
									PLZ Stadt<br />
									Deutschland
								</p>
							</div>

							<div>
								<h2 class="text-2xl font-semibold text-black dark:text-purpleish-50 mb-3">
									Kontakt
								</h2>
								<p>
									E-Mail:
									<a
										href="mailto:info@kardr.de"
										class="text-dollepink-500 hover:text-dollepink-400"
										>info@kardr.de</a
									><br />
									Telefon: +49 (0) XXX XXXXXXXX
								</p>
							</div>

							<div>
								<h2 class="text-2xl font-semibold text-black dark:text-purpleish-50 mb-3">
									Verantwortlich für den Inhalt
								</h2>
								<p>
									Dein Name<br />
									Deine Adresse<br />
									PLZ Stadt
								</p>
							</div>

							<div>
								<h2 class="text-2xl font-semibold text-black dark:text-purpleish-50 mb-3">
									Haftungsausschluss
								</h2>
								<p>
									Die Inhalte unserer Seiten wurden mit großer Sorgfalt erstellt. Für die
									Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir
									jedoch keine Gewähr übernehmen.
								</p>
							</div>
						</div>

						<NuxtLink to="/" class="inline-block mt-12">
							<UButton
								variant="outline"
								class="border-gray-300 dark:border-white/15 text-black dark:text-purpleish-50"
							>
								← Zurück zur Startseite
							</UButton>
						</NuxtLink>
					</div>
				</section>
			</main>
		</MaxContainer>
	</div>
</template>
