<script setup lang="ts">
import type { DecksRecord } from "~/types/pb"

const props = defineProps<{
	deck?: DecksRecord
	roomId?: string
}>()

const emit = defineEmits(["decksUpdated"])

// ----------------------------------------------------------------------------

const deckName = ref("")
const deckDescription = ref("")

// ----------------------------------------------------------------------------

if (props.deck) {
	deckDescription.value = props.deck.description || ""
	deckName.value = props.deck.name || ""
}

// ----------------------------------------------------------------------------

const createDeck = async () => {
	if (pb.authStore.record?.id == undefined) {
		throw new Error("User not authenticated")
	}

	if (props.deck) {
		await pb.collection("decks").update(props.deck.id, {
			name: deckName.value,
			description: deckDescription.value,
		})
	} else {
		if (!props.roomId) {
			toastError("Room ID is required to create a deck")
			return
		}
		await pb.collection("decks").create({
			name: deckName.value,
			description: deckDescription.value,
			creator: pb.authStore.record.id,
			roomId: props.roomId,
		})
	}
	emit("decksUpdated")
}

// ----------------------------------------------------------------------------

//TODO: Route back to room page after deletion
const deleteDeck = async () => {
	if (!props.deck) return

	try {
		await pb.collection("decks").delete(props.deck.id)
		useToast().add({
			title: "Deck deleted successfully",
			color: "success",
		})
		emit("decksUpdated")
		navigateTo(`/room/${props.deck.roomId}`)
	} catch (error) {
		toastError(`${error}`)
	}
}
</script>

<template>
	<UModal title="Create new Deck" aria-describedby="Modal to create new Decks">
		<slot></slot>

		<!-- ----------------------------------------------------------------------------- -->

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
			</div>
		</template>

		<!-- ----------------------------------------------------------------------------- -->

		<template #footer="{ close }">
			<div class="space-y-2 w-full">
				<div class="flex gap-2">
					<UButton v-if="props.deck" variant="subtle" @click="(deleteDeck(), close())">
						<UIcon size="20" name="lucide:trash-2" />
					</UButton>

					<UButton size="xl" block @click="(createDeck(), close())">
						{{ props.deck ? "Save Changes" : "Create Deck" }}
					</UButton>
				</div>
			</div>
		</template>
	</UModal>
</template>
