<script setup lang="ts">
const emit = defineEmits(["created"])

const open = defineModel<boolean>("open")

const user = new User()

const collectionTitle = ref("")
const collectionDescription = ref("")

const emailList = ref<string[]>([])

function createCollection(close: () => void) {
	if (!user) {
		throw new Error("User must be logged in to create a collection")
	}

	try {
		pb.collection("rooms").create({
			id: "",
			user: [user.id],
			creator: user.id,
			name: collectionTitle.value,
			description: collectionDescription.value,
		})
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
}
</script>

<template>
	<UModal
		v-model:open="open"
		aria-describedby="create-collection-modal"
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
		<template #footer="{ close }">
			<UButton color="primary" size="xl" class="w-full" @click="createCollection(close)"
				>Create Deck</UButton
			>
		</template>
		<slot />
	</UModal>
</template>
