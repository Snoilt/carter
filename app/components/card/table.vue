<script setup lang="ts">
import type { CardsRecord, DecksRecord } from "~/types/pb"
import DOMPurify from "dompurify"
import type { TableColumn } from "@nuxt/ui"

const props = defineProps<{
	deck: DecksRecord
}>()

// ----------------------------------------------------------------------------

const cards = ref<CardsRecord[]>([])
const tableData = ref<Array<{ front: string; back: string }>>([])
const cardHandlerReference = ref()

type TableColumnData = {
	front: string
	back: string
}

const UButton = resolveComponent("UButton")
const columns: TableColumn<TableColumnData>[] = [
	{
		id: "actions",
		header: "Edit",
		cell: () => {
			return h(UButton, {
				icon: "lucide:pencil-line",
				color: "primary",

				onClick: () => (cardHandlerReference.value.open = true),
			})
		},
	},
	{
		accessorKey: "front",
		header: "Front",
	},
	{
		accessorKey: "back",
		header: "Back",
	},
]
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
	<CardHandler ref="cardHandlerReference" />
	<UTable :columns="columns" :data="tableData" />
	<UButton icon="lucide:plus" size="xl" block>New Card</UButton>
</template>
