<script setup lang="ts">
import type { RoomsRecord } from "~/types/pb"

const route = useRoute()
const currentRoom = ref<RoomsRecord>()

onMounted(async () => {
	try {
		currentRoom.value = await pb.collection("rooms").getOne(route.params.slug as string, {
			expand: "user.name",
		})
	} catch (error) {
		console.error("Failed to fetch room:", error)
	}
})
</script>

<template>
	<UContainer v-if="currentRoom">
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
			<RoomDecks :room="currentRoom" />
			<div>
				<h1 class="font-bold text-xl">Members</h1>
				<RoomUsers :collection="currentRoom" />
			</div>
		</div>
	</UContainer>
</template>
