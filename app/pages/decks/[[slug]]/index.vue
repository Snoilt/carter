<script setup lang="ts">
import type { DeckcollectionsRecord } from "~/types/pb"

const route = useRoute()
const currentCollection = ref<DeckcollectionsRecord>()

onMounted(async () => {
	currentCollection.value = await pb
		.collection("deckcollections")
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
