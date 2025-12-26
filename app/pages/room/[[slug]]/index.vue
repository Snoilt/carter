<script setup lang="ts">
import type { RoomsRecord } from "~/types/pb"

const route = useRoute()
const currentRoom = ref<RoomsRecord>()

onMounted(async () => {
	currentRoom.value = await pb.collection("rooms").getOne(route.params.slug as string, {
		expand: "user.name",
	})
})
</script>

<template>
	<UContainer>
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
			<RoomDecks />
			<div>
				<h1 class="font-bold text-xl">Members</h1>
				<RoomUsers v-if="currentRoom" :collection="currentRoom" />
			</div>
		</div>
	</UContainer>
</template>
