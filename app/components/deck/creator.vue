<script setup lang="ts">
import type { DecksRecord } from "~/types/pb"

const props = defineProps<{
	deck?: DecksRecord
}>()

const emit = defineEmits(["deckCreated"])

const deckName = ref("")
const deckDescription = ref("")

const createDeck = async () => {
	if (pb.authStore.record?.id == undefined) {
		throw new Error("User not authenticated")
	}

	pb.collection("decks").create({
		name: deckName.value,
		description: deckDescription.value,
		creator: pb.authStore.record.id,
	})
	emit("deckCreated")
	console.log("Deck created:", deckName.value, deckDescription.value)
}
</script>

<template>
	<UModal title="Create new Deck" aria-describedby="Modal to create new Decks">
		<slot></slot>
		<template #body>
			<div class="space-y-4">
				<div class="space-y-2">
					<h1>Deck Name</h1>
					<UInput v-model="deckName" placeholder="Subject" size="xl" class="w-full" />
				</div>
				<div class="space-y-2">
					<h1>Deck Description</h1>
					<UInput
						v-model="deckDescription"
						placeholder="Description"
						size="xl"
						class="w-full"
					/>
				</div>
				<UButton size="xl" block @click="createDeck">Create Deck</UButton>
			</div>
		</template>
	</UModal>
</template>
