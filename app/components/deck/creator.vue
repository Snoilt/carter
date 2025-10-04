<script setup lang="ts">
import type { AuthRecord } from "pocketbase"
import type { DecksRecord } from "~/types/pb"

const user: AuthRecord = pb.authStore.record

const deckTitle = ref("")
const deckDescription = ref("")
const deckEmails = ref<string[]>([])

function createDeck(close: () => void) {
	if (!user) {
		throw new Error("User must be logged in to create a deck")
	}

	const newDeck: DecksRecord = {
		id: "",
		user: [user.id],
		creator: user.id,
		name: deckTitle.value,
		description: deckDescription.value,
	}

	try {
		pb.collection("decks").create(newDeck)
		useToast().add({
			title: "Deck created successfully",
			color: "success",
		})
	} catch (error) {
		toastError(`${error}`)
	}

	close()
}
</script>

<template>
	<UModal title="Create a new Deck">
		<template #body>
			<UForm class="space-y-4">
				<UFormField name="title" label="Deck Title">
					<UInput v-model="deckTitle" placeholder="Biology" size="xl" class="w-full" />
				</UFormField>
				<UFormField name="description" label="Description (optional)">
					<UInput
						v-model="deckDescription"
						placeholder="My Biology Deck"
						size="xl"
						class="w-full"
					/>
				</UFormField>
				<UFormField name="emails" label="Share with Others">
					<UInputTags
						v-model="deckEmails"
						placeholder="Press enter to add E-Mails"
						size="xl"
						class="w-full"
					/>
				</UFormField>
			</UForm>
		</template>
		<template #footer="{ close }">
			<UButton color="primary" size="xl" class="w-full" @click="createDeck(close)"
				>Create Deck</UButton
			>
		</template>
		<slot />
	</UModal>
</template>
