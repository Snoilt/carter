<script setup lang="ts">
import type { DeckcollectionsRecord, DeckcollectionsResponse } from "~/types/pb"

const emit = defineEmits(["created"])

const user = new User()

const collectionTitle = ref("")
const collectionDescription = ref("")

const props = defineProps<{
	deckCollection?: DeckcollectionsResponse
}>()

//TODO: Implement sharing functionality
const emailList = ref<string[]>([])

function createCollection(close: () => void) {
	if (!user) {
		throw new Error("User must be logged in to create a collection")
	}

	

	const newCollection: DeckcollectionsRecord = {
		id: "",
		user: [user.id],
		creator: user.id,
		name: collectionTitle.value,
		description: collectionDescription.value,
	}


	// if einbauen das hier wenn keine da ist beziehungsweise wenn create gedrückt wird der 
	// hier stehende befehl ausgeführt wird und wenn edit einen neuen erstellen der das schon vorhandene dann bearebbeitet wird, 
	// edit soll ausgeführt werden wenn deckcollection an komponente übergeben wird
	try {
		pb.collection("deckcollections").create(newCollection)
		useToast().add({
            title: "Deck created successfully",
			color: "success",
		})
	} catch (error) {
        toastError(`${error}`)
	}
    
	close()
    emit("created")
	console.log("Collection created, modal closed")
	//   collectionTitle.value = ""
	//   collectionDescription.value = ""
	//   emailList.value = []
}
</script>

<template>
	<!-- hier wenn edit anderer text also if  und dann block als edit kopieren -->
	<UModal title="Create a new Collection">
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
		<template #footer="{ close }">
			<UButton color="primary" size="xl" class="w-full" @click="createCollection(close)"
				>Create Deck</UButton
			>
		</template>
		<slot />
	</UModal>
</template>
