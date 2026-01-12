<script setup lang="ts">
import type { RoomsRecord } from "~/types/pb"

const emit = defineEmits(["collectionsUpdated"])
const props = defineProps<{
	room?: RoomsRecord
}>()

// ----------------------------------------------------------------------------

const open = defineModel<boolean>("open")
const user = new User()
const collectionTitle = ref("")
const collectionDescription = ref("")
const emailList = ref<string[]>([])

//----------------------------------------------------------------------------

if (props.room) {
	collectionDescription.value = props.room.description || ""
	collectionTitle.value = props.room.name || ""
}

// ----------------------------------------------------------------------------

const createCollection = async (close: () => void) => {
	if (!user) {
		throw new Error("User must be logged in to create a collection")
	}
	if (props.room) {
		try {
			await pb.collection("rooms").update(props.room.id, {
				name: collectionTitle.value,
				description: collectionDescription.value,
			})
			useToast().add({
				title: "Room edited successfully",
				color: "success",
			})
		} catch (error) {
			console.error("Error updating room:", error)
		}
	} else {
		try {
			await pb.collection("rooms").create({
				id: "",
				user: [user.id],
				creator: user.id,
				name: collectionTitle.value,
				description: collectionDescription.value,
			})

			useToast().add({
				title: "Room created successfully",
				color: "success",
			})
		} catch (error) {
			console.error("Error creating room:", error)
		}
	}
	close()
	emit("collectionsUpdated")
	collectionTitle.value = ""
	collectionDescription.value = ""
	emailList.value = []
}
</script>

<template>
	<UModal
		v-model:open="open"
		aria-describedby="create-room-modal"
		title="Create a new Collection"
	>
		<template #body>
			<UForm class="space-y-4">
				<UFormField name="title" label="Collection Title">
					<UInput
						v-model="collectionTitle"
						placeholder="Biology"
						size="xl"
						class="w-full"
					/>
				</UFormField>
				<UFormField name="description" label="Description (optional)">
					<UInput
						v-model="collectionDescription"
						placeholder="My Biology Collection"
						size="xl"
						class="w-full"
					/>
				</UFormField>
				<UFormField name="emails" label="Share with Others">
					<UInputTags
						v-model="emailList"
						placeholder="Press enter to add E-Mails"
						size="xl"
						class="w-full"
					/>
				</UFormField>
			</UForm>
		</template>

		<!-- ---------------------------------------------------------------------------- -->

		<template #footer="{ close }">
			<UButton
				color="primary"
				size="xl"
				class="text-center w-full"
				@click="createCollection(close)"
			>
				{{ props.room ? "Save Deck" : "Create Deck" }}
			</UButton>
		</template>
		<slot />
	</UModal>
</template>
