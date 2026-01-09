<script setup lang="ts">
import { definePageMeta } from "#imports"

definePageMeta({
	title: "Datenschutz — Kardr",
	meta: [
		{
			name: "description",
			content: "Datenschutzerklärung von Kardr",
		},
	],
})
</script>

<template>
	<div
		class="relative isolate min-h-svh overflow-hidden bg-white text-black dark:bg-randoblue-950 dark:text-purpleish-50"
	>
		<DotGrid class="pointer-events-none absolute inset-0 z-0 opacity-35" />
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
							Datenschutzerklärung
						</h1>

						<div class="space-y-8 text-gray-700 dark:text-purpleish-100/80">
							<div>
								<h2 class="text-2xl font-semibold text-black dark:text-purpleish-50 mb-3">
									1. Datenschutz auf einen Blick
								</h2>
								<p>
									Wir nehmen den Schutz deiner persönlichen Daten sehr ernst. Diese
									Datenschutzerklärung erläutert, welche Daten wir erfassen und wie wir
									diese nutzen.
								</p>
							</div>

							<div>
								<h2 class="text-2xl font-semibold text-black dark:text-purpleish-50 mb-3">
									2. Erfassung von Daten
								</h2>
								<p>
									Wir erfassen deine Daten nur, wenn du dich registrierst oder mit Kardr
									interagierst. Dies umfasst:
								</p>
								<ul class="list-disc pl-6 mt-3 space-y-2">
									<li>Benutzername und E-Mail-Adresse</li>
									<li>Lernhistorie und Spielfortschritt</li>
									<li>IP-Adresse und Browser-Informationen</li>
								</ul>
							</div>

							<div>
								<h2 class="text-2xl font-semibold text-black dark:text-purpleish-50 mb-3">
									3. Nutzung deiner Daten
								</h2>
								<p>Deine Daten nutzen wir nur für:</p>
								<ul class="list-disc pl-6 mt-3 space-y-2">
									<li>Bereitstellung unserer Services</li>
									<li>Verbesserung von Kardr</li>
									<li>Kommunikation mit dir</li>
								</ul>
							</div>

							<div>
								<h2 class="text-2xl font-semibold text-black dark:text-purpleish-50 mb-3">
									4. Datenschutzbeauftragte
								</h2>
								<p>
									Bei Fragen zu deinen Daten kontaktiere uns unter:<br />
									E-Mail:
									<a
										href="mailto:datenschutz@kardr.de"
										class="text-dollepink-500 hover:text-dollepink-400"
										>datenschutz@kardr.de</a
									>
								</p>
							</div>

							<div>
								<h2 class="text-2xl font-semibold text-black dark:text-purpleish-50 mb-3">
									5. Deine Rechte
								</h2>
								<p>Du hast das Recht auf:</p>
								<ul class="list-disc pl-6 mt-3 space-y-2">
									<li>Auskunft über deine Daten</li>
									<li>Berichtigung fehlerhafter Daten</li>
									<li>Löschung deiner Daten</li>
								</ul>
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
