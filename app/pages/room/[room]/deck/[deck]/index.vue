<script setup lang="ts">
import type { DecksRecord } from "~/types/pb"
const router = useRouter()

const deck = ref<DecksRecord>()

// ----------------------------------------------------------------------------

const fetchDeck = async () => {
	try {
		deck.value = await pb
			.collection("decks")
			.getOne(router.currentRoute.value.params.deck as string)
	} catch (error) {
		console.error("Failed to fetch deck:", error)
	}
}

// ----------------------------------------------------------------------------

onMounted(async () => {
	await fetchDeck()
})
</script>

<template>
	<UContainer v-if="deck" class="space-y-4">
		<UCard class="mt-4">
			<template #header>
				<h1>Currently Editing</h1>
			</template>
			<div class="grid grid-cols-[85%_15%] items-center gap-4">
				<div>
					<p class="font-bold">{{ deck.name }}</p>
					<p class="text-gray-600">{{ deck.description }}</p>
				</div>
				<DeckCreator
					class="max-w-10 flex items-center justify-end"
					:deck="deck"
					@decks-updated="fetchDeck()"
				>
					<UButton icon="lucide:pencil-ruler" size="xl" variant="subtle" />
				</DeckCreator>
			</div>
		</UCard>

		<CardTable :deck="deck" />
	</UContainer>
</template>
