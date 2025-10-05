<script setup lang="ts">
const collections = await useUser().getCollections()
</script>

<template>
	<UContainer class="space-y-6">
		<h1 class="mt-5 text-xl font-bold">Your Collections</h1>
		<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
			<DeckCreator>
				<UButton variant="outline" icon="lucide:plus" size="xl" class="justify-center"
					>Create Collection</UButton
				>
			</DeckCreator>

			<UCard v-for="collection in collections" :key="collection.name" variant="subtle">
				<template #header>
					<div class="flex items-center justify-between">
						<h1>{{ collection.name }}</h1>
						<DeckDropdown :collection="collection" />
					</div>
				</template>

				<p class="font-light text-sm text-gray-500 mt-2">{{ collection.description }}</p>
				<div class="flex items-center space-x-3"></div>
				<div class="font-light text-sm text-gray-500 mt-2">
					<!-- <p>{{ collection.cards }} Cards</p> -->
					<!-- <p>{{ collection.lastPlayed }} days ago</p> -->
				</div>

				<template #footer>
					<UButton size="xl" block variant="outline">Join</UButton>
				</template>
			</UCard>
		</div>
	</UContainer>
</template>
