<script setup lang="ts">
import type { DecksRecord, RoomsRecord } from "~/types/pb"

const decks = ref<DecksRecord[]>([])
const props = defineProps<{
	room: RoomsRecord
}>()

// ----------------------------------------------------------------------------

const fetchDecks = async () => {
	// TODO: Create API rules to restrict access
	decks.value = await pb
		.collection("decks")
		.getFullList({ filter: `roomId = "${props.room.id}"` })
	console.log("decks:", decks.value)
}

// ----------------------------------------------------------------------------

onMounted(async () => {
	await fetchDecks()
})
</script>

<template>
	<UPageList>
		<h1 class="font-bold text-xl">Decks</h1>

		<!-- ---------------------------------------------------------------------------- -->
		<UPageCard
			v-for="deck in decks"
			:key="deck.id"
			:description="deck.description"
			:title="deck.name"
			class="mt-5"
		>
			<template #footer>
				<div class="flex space-x-2">
					<NuxtLink :to="`/room/${props.room.id}/play/${deck.id}`">
						<UButton size="xl" block variant="outline">
							<UIcon name="lucide:play" />
						</UButton>
					</NuxtLink>

					<NuxtLink :to="`/room/${props.room.id}/deck/${deck.id}`">
						<UButton size="xl" block variant="outline">
							<UIcon name="lucide:pencil-line" />
						</UButton>
					</NuxtLink>

					<UButton size="xl" block variant="outline">
						<UIcon name="lucide:info" />
					</UButton>
				</div>
			</template>
		</UPageCard>

		<!-- ---------------------------------------------------------------------------- -->

		<!-- Maybe Move to Parent Component -->
		<DeckCreator :room-id="props.room.id" @decks-updated="fetchDecks()">
			<UButton size="xl" class="mt-5"
				><UIcon size="20" name="lucide:plus" /> Create new Deck
			</UButton>
		</DeckCreator>
	</UPageList>
</template>
