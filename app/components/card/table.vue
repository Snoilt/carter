<script setup lang="ts">
import type { CardsRecord, DecksRecord } from "~/types/pb"
import DOMPurify from "dompurify"

const props = defineProps<{
	deck: DecksRecord
}>()

// ----------------------------------------------------------------------------

const cards = ref<CardsRecord[]>([])
const tableData = ref<Array<{ front: string; back: string }>>([])

// ----------------------------------------------------------------------------

//TODO: add api rules to restrict access
const fetchCards = async () => {
	try {
		cards.value = await pb
			.collection("cards")
			.getFullList({ filter: `deck = "${props.deck.id}"` })
	} catch (error) {
		console.error("Failed to fetch cards:", error)
	}
}

// ----------------------------------------------------------------------------

const formatCards = () => {
	return cards.value.map((card) => ({
		front: DOMPurify.sanitize(card.question ?? "", { USE_PROFILES: { html: false } }),
		back: DOMPurify.sanitize(card.solution ?? "", { USE_PROFILES: { html: false } }),
	}))
}

// ----------------------------------------------------------------------------

onMounted(async () => {
	await fetchCards()
	tableData.value = formatCards()
	console.log("Deck:", props.deck, "Cards fetched", cards.value)
})
</script>

<template>
	<UTable :data="tableData" />
</template>
