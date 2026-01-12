<script setup lang="ts">
import type { RoomsResponse } from "~/types/pb"

const collections = ref<RoomsResponse[]>([])

const fetchCollections = async () => {
	try {
		collections.value = await pb.collection("rooms").getFullList<RoomsResponse>({
			sort: "-created",
		})
	} catch (error) {
		console.error("Failed to fetch collections:", error)
	}
}

onMounted(async () => {
	await fetchCollections()
})
</script>

<template>
	<UContainer class="space-y-6">
		<h1 class="mt-5 text-xl font-bold">Your Collections</h1>
		<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
			<RoomCreator @collections-updated="fetchCollections()">
				<UButton variant="outline" icon="lucide:plus" size="xl" class="justify-center"
					>Create Collection</UButton
				>
			</RoomCreator>

			<UCard v-if="collections.length === 0" variant="subtle">
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
						<RoomDropdown :room="collection" @action="fetchCollections" />
					</div>
				</template>

				<p class="font-light text-sm text-gray-500 mt-2">{{ collection.description }}</p>
				<div class="flex items-center space-x-3"></div>
				<div class="font-light text-sm text-gray-500 mt-2"></div>

				<template #footer>
					<NuxtLink :to="`/room/${collection.id}`">
						<UButton size="xl" block variant="outline">Join</UButton></NuxtLink
					>
				</template>
			</UCard>
		</div>
	</UContainer>
</template>
