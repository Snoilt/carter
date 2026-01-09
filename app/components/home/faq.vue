<!-- FAQ -->
<script setup lang="ts">
import { ref } from "vue"

const faqItemsNew = ref([
	{
		label: "Ist Kardr kostenlos?",
		content:
			"Ja! Kardr ist vollständig kostenlos. Du kannst sofort Decks erstellen, Duelle spielen und gegen andere antreten — ohne versteckte Kosten oder Abos.",
	},
	{
		label: "Wie funktionieren Duelle?",
		content:
			"In einem 1v1 Duell beantwortest du zusammen mit einem:einer Opponent:in die gleichen Karteikarten. Wer schneller und korrekter antwortet, gewinnt Punkte und XP. Das beste: Duelle dauern nur wenige Minuten!",
	},
	{
		label: "Brauche ich eine App?",
		content:
			"Nein! Kardr läuft komplett im Browser — auf Desktop, Tablet und Smartphone. Einfach die Website öffnen und los geht's!",
	},
	{
		label: "Kann ich Decks mit meinen Mitschüler:innen teilen?",
		content:
			"Ja, genau! Du kannst deine Decks mit einem Link teilen oder sie öffentlich verfügbar machen. So können alle von deinen Lernmaterialien profitieren — perfekt für Kurse und Lerngruppen.",
	},
	{
		label: "Was sind Streaks und wie funktionieren sie?",
		content:
			"Ein Streak ist eine tägliche Lernkette: Je mehr Tage du hintereinander spielst, desto länger wird dein Streak. Das motiviert dich, regelmäßig zu lernen und Konsistenz zu belohnen.",
	},
	{
		label: "Wie sehe ich meinen Fortschritt?",
		content:
			"Dein Dashboard zeigt dir alles: Gewonnene Duelle, gesammelte XP, aktuelle Streaks und deine Position in der globalen Rangliste. So siehst du sofort, wie gut du vorankommst.",
	},
	{
		label: "Gibt es eine Rangliste?",
		content:
			"Ja! In der globalen Rangliste siehst du die Top-Spieler:innen. Du kannst auch Schulen oder Kurse vergleichen und gemeinsam mit Freund:innen aufsteigen.",
	},
	{
		label: "Welche Fächer kann ich lernen?",
		content:
			"Mit Kardr kannst du alles lernen: Sprachen, Mathe, Geschichte, Biologie, Programmierung — oder eigene Decks erstellen. Die Community teilt ständig neue Decks!",
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
			"Ja! Kardr nutzt den gleichen Spaced-Repetition-Algorithmus wie Anki. Du kannst deine .apkg-Dateien direkt importieren und nahtlos in Kardr weitermachen.",
	},
	{
		label: "Was ist der Spaced-Repetition-Algorithmus?",
		content:
			"Spaced Repetition ist eine wissenschaftlich bewiesene Lernmethode: Du wiederholst Inhalte in optimalen Zeitabständen, um langfristiges Gedächtnis zu maximieren. Kardr nutzt den gleichen Algorithmus wie das beliebte Tool Anki.",
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
