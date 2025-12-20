<script setup lang="ts">
import type { RoomsResponse } from "~/types/pb"

const collections = ref<RoomsResponse[]>([])
const loading = ref(false)

const fetchCollections = async () => {
	loading.value = true
	try {
		const user = new User()
		if (!user) {
			throw new Error("User must be logged in to view collections")
		}

		const result = await pb.collection("rooms").getFullList<RoomsResponse>(undefined, {
			filter: `user ~ "${user.id}"`,
			sort: "-created",
		})
		console.log(collections)
		collections.value = result
		console.log("Collections fetched:", collections.value)
	} catch (error) {
		toastError(`${error}`)
	} finally {
		loading.value = false
	}
}

onMounted(() => {
	fetchCollections()
})
</script>

<template>
	<UContainer class="space-y-6">
		<h1 class="mt-5 text-xl font-bold">Your Collections</h1>
		<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
			<DeckCreator @created="fetchCollections">
				<UButton variant="outline" icon="lucide:plus" size="xl" class="justify-center"
					>Create Collection</UButton
				>
			</DeckCreator>

			<UCard v-if="!loading && collections.length === 0" variant="subtle">
				<template #header>
					<h1>No collections yet</h1>
				</template>
				<p class="text-sm text-gray-500">Create your first collection to get started.</p>
			</UCard>

			<UCard
				v-for="collection in collections"
				:key="collection.id || collection.name"
				variant="subtle"
			>
				<template #header>
					<div class="flex items-center justify-between">
						<h1>{{ collection.name }}</h1>
						<DeckDropdown :collection="collection" @action="fetchCollections" />
					</div>
				</template>

				<p class="font-light text-sm text-gray-500 mt-2">{{ collection.description }}</p>
				<div class="flex items-center space-x-3"></div>
				<div class="font-light text-sm text-gray-500 mt-2">
					<!-- <p>{{ collection.cards }} Cards</p> -->
					<!-- <p>{{ collection.lastPlayed }} days ago</p> -->
				</div>

				<template #footer>
					<UButton size="xl" block variant="outline"
						><NuxtLink :to="`/decks/${collection.id}`">Join</NuxtLink></UButton
					>
				</template>
			</UCard>
		</div>
	</UContainer>
</template>
