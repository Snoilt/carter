<script setup lang="ts">
import { faker } from "@faker-js/faker"

const decks = Array.from({ length: 6 }, () => ({
	title: faker.lorem.words(1),
	cards: faker.number.int({ min: 10, max: 100 }),
	lastPlayed: faker.number.int({ min: 1, max: 100 }),
	progress: faker.number.int({ min: 0, max: 100 }),
}))

const items = ref([
	{ label: "Edit", icon: "lucide:pencil" },
	{ label: "Share", icon: "lucide:share-2" },
	{ label: "Delete", icon: "lucide:trash" },
])
</script>
<template>
	<UContainer class="space-y-6">
		<!-- <h1 class="m-5 text-3xl font-bold">Dashboard</h1> -->
		<div class="mt-5 space-y-2">
			<h1 class="font-bold text-xl">Hello {{ faker.internet.displayName() }}</h1>
			<p>You have played 12 Hours and 43 minutes in the past 2 Weeks 🥳</p>
		</div>
		<USeparator />
		<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
			<!-- <UButton icon="lucide:plus" size="xl" block variant="outline">
				Create new Deck
			</UButton> -->
			<UCard v-for="deck in decks" :key="deck.title" variant="subtle">
				<template #header>
					<div class="flex items-center justify-between">
						<h1>Deck {{ deck.title }}</h1>
						<UDropdownMenu :ui="{ content: 'w-40' }" :items="items">
							<UButton variant="ghost" size="sm" icon="lucide:more-horizontal" />
						</UDropdownMenu>
					</div>
				</template>

				<div class="flex items-center space-x-3">
					<UProgress v-model="deck.progress" />
					<UIcon size="20" name="lucide:party-popper" />
				</div>
				<div class="font-light text-sm text-gray-500 mt-2">
					<p>{{ deck.cards }} Cards</p>
					<p>{{ deck.lastPlayed }} days ago</p>
				</div>

				<template #footer>
					<UButton size="xl" block variant="outline">Study Now</UButton>
				</template>
			</UCard>
		</div>
	</UContainer>
</template>
