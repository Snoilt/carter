<script setup lang="ts">
// import { faker } from "@faker-js/faker"
import type { DecksRecord, DecksResponse } from "~/types/pb"

// const route = useRoute()

const decks = await pb.collection("decks").getFullList<DecksResponse>()

console.log(decks)

const items = ref([
	{ label: "Edit", icon: "lucide:pencil" },
	{ label: "Share", icon: "lucide:share-2" },
	{ label: "Delete", icon: "lucide:trash" },
])
</script>

<template>
	<UContainer class="space-y-6">
		<h1 class="mt-5 text-xl font-bold">Your Decks</h1>
		<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
			<DeckCreator>
				<UButton variant="outline" icon="lucide:plus" size="xl" class="justify-center"
					>Create Deck</UButton
				>
			</DeckCreator>

			<UCard v-for="deck in decks" :key="deck.name" variant="subtle">
				<template #header>
					<div class="flex items-center justify-between">
						<h1>{{ deck.name }}</h1>
						<UDropdownMenu :ui="{ content: 'w-40' }" :items="items">
							<UButton variant="ghost" size="sm" icon="lucide:more-horizontal" />
						</UDropdownMenu>
					</div>
				</template>

				<p class="font-light text-sm text-gray-500 mt-2">{{ deck.description }}</p>
				<div class="flex items-center space-x-3"></div>
				<div class="font-light text-sm text-gray-500 mt-2">
					<!-- <p>{{ deck.cards }} Cards</p> -->
					<!-- <p>{{ deck.lastPlayed }} days ago</p> -->
				</div>

				<template #footer>
					<UButton size="xl" block variant="outline">Study Now</UButton>
				</template>
			</UCard>
		</div>
	</UContainer>
</template>
