<script setup lang="ts">
import type { CardsRecord, DecksRecord } from "~/types/pb"
import type { TableColumn } from "@nuxt/ui"

const props = defineProps<{
	deck: DecksRecord
}>()

// ----------------------------------------------------------------------------

const cards = ref<CardsRecord[]>([])

const CardHandler = resolveComponent("CardHandler")
const columns: TableColumn<CardsRecord>[] = [
	{
		id: "actions",
		header: "Edit",
		cell: ({ row }) => {
			return h(CardHandler, {
				icon: "lucide:pencil-line",
				color: "primary",
				card: cards.value[row.index],
				deck: props.deck,
				onCardUpdate: async () => {
					await fetchCards()
				},
			})
		},
	},
	{
		accessorKey: "question",
		header: "Front",
	},
	{
		accessorKey: "solution",
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

onMounted(async () => {
	await fetchCards()
	console.log("Deck:", props.deck, "Cards fetched", cards.value)
})
</script>

<template>
	<!-- <CardHandler ref="cardHandlerReference" /> -->
	<UTable :columns="columns" :data="cards" />
	<CardHandler :deck="props.deck" @card-update="fetchCards()">
		<UButton icon="lucide:plus" size="xl" block>New Card</UButton>
	</CardHandler>
</template>
