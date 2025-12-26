<script setup lang="ts">
import type { DecksRecord } from "~/types/pb"

const decks = ref<DecksRecord[]>([])

const fetchDecks = async () => {
	decks.value = await pb.collection("decks").getFullList()
	console.log("decks:", decks.value)
}

onMounted(async () => {
	await fetchDecks()
})
</script>

<template>
	<UPageList>
		<h1 class="font-bold text-xl">Decks</h1>
		<UPageCard
			v-for="deck in decks"
			:key="deck.id"
			:description="deck.description"
			:title="deck.name"
			class="mt-5"
		>
			<template #footer>
				<div class="flex space-x-2">
					<UButton size="xl" block variant="outline">
						<UIcon name="lucide:play" />
					</UButton>

					<UButton size="xl" block variant="outline">
						<UIcon name="lucide:pencil-line" />
					</UButton>
				</div>
			</template>
		</UPageCard>
		<DeckCreator @deck-created="fetchDecks()">
			<UButton size="xl" class="mt-5"
				><UIcon size="20" name="lucide:plus" /> Create new Deck
			</UButton>
		</DeckCreator>
	</UPageList>
</template>
