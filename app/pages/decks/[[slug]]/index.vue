<script setup lang="ts">
import type { RoomsRecord } from "~/types/pb"

const route = useRoute()
const currentCollection = ref<RoomsRecord>()

onMounted(async () => {
	currentCollection.value = await pb
		.collection("rooms")
		.getOne(route.params.slug as string, {
			expand: "user.name",
		})
})
</script>

<template>
	<UContainer>
		<DeckUsers v-if="currentCollection" :collection="currentCollection" />
	</UContainer>
</template>
