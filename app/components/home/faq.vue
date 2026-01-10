<!-- FAQ -->
<script setup lang="ts">
import { ref } from "vue"

const faqItemsNew = ref([
	{
		label: "Ist Kardr kostenlos?",
		content:
			"Ja! Kardr ist vollständig kostenlos. Du kannst sofort Decks erstellen und gegen andere antreten — ohne versteckte Kosten oder Abos.",
	},
	{
		label: "Kann ich Decks mit meinen Mitschüler:innen teilen?",
		content:
			"Ja, genau! Du kannst deine Decks mit einem Link teilen. So können Freunde von deinen Lernmaterialien profitieren — perfekt für Kurse und Lerngruppen.",
	},
	{
		label: "Was sind Streaks und wie funktionieren sie?",
		content:
			"Eine Streak ist eine tägliche Lernkette: Je mehr Tage du hintereinander spielst, desto länger wird deine Streak. Das motiviert dich, regelmäßig zu lernen und Konsistenz zu belohnen.",
	},
	{
		label: "Wie sehe ich meinen Fortschritt?",
		content:
			"Dein Dashboard zeigt dir alles: gesammelter Score und aktuelle Streaks. So siehst du sofort, wie gut du vorankommst.",
	},
	{
		label: "Wie viele Karteikarten sollte ein Deck haben?",
		content:
			"Das ist flexibel! Kleine Decks (10-20 Karten) sind perfekt für schnelle Sessions, größere Decks (50+) für gründliches Lernen. Es gibt keine Limits.",
	},
	{
		label: "Kann ich gegen Freund:innen spielen?",
		content:
			"Absolut! Du kannst Freund:innen hinzufügen und direkt gegen sie antreten. So wird Lernen zum gemeinsamen Abenteuer.",
	},
	{
		label: "Kann ich meine Anki-Decks importieren?",
		content:
			"Ja! Kardr nutzt auch FSRS, wie Anki. Du kannst deine .apkg-Dateien direkt importieren und nahtlos in Kardr weitermachen.",
	},
	{
		label: "Was ist der Spaced-Repetition-Algorithmus?",
		content:
			"Spaced Repetition ist eine wissenschaftlich bewiesene Lernmethode: Du wiederholst Inhalte in optimalen Zeitabständen, um langfristiges Gedächtnis zu maximieren. Kardr nutzt auch FSRS, wie das beliebte Tool Anki.",
	},
])
</script>
<template>
	<section id="faq" class="pt-14">
		<h2
			class="text-2xl font-bold tracking-tight md:text-3xl text-black dark:text-purpleish-50"
		>
			FAQ
		</h2>

		<!-- Animated FAQ -->
		<UAccordion :items="faqItemsNew" class="mt-8" />
	</section>
</template>
