<script setup lang="ts">
import type { DeckcollectionsRecord, DeckcollectionsResponse } from "~/types/pb"

const emit = defineEmits(["created"])
const user = new User()

// Deine Props
const props = defineProps<{
    deckCollection?: DeckcollectionsResponse
}>()

const collectionTitle = ref("")
const collectionDescription = ref("")
const emailList = ref<string[]>([])

// --- NEU: HIER WIRD GEPRÜFT, OB WIR EDITIEREN ---
// Dieser "Watch" sorgt dafür, dass die Felder ausgefüllt sind, wenn eine Collection übergeben wird
watch(() => props.deckCollection, (newValue) => {
    if (newValue) {
        // Wir sind im Edit-Modus: Werte übernehmen
        collectionTitle.value = newValue.name
        collectionDescription.value = newValue.description
        // Falls du E-Mails hast, müsstest du sie hier auch laden
    } else {
        // Wir sind im Create-Modus: Felder leeren
        collectionTitle.value = ""
        collectionDescription.value = ""
        emailList.value = []
    }
}, { immediate: true })
// ------------------------------------------------


async function createCollection(close: () => void) {
    if (!user) {
        throw new Error("User must be logged in")
    }

    const newCollection: DeckcollectionsRecord = {
        id: "",
        user: [user.id],
        creator: user.id,
        name: collectionTitle.value,
        description: collectionDescription.value,
    }

    try {
        // DEINE IF-LOGIK VON VORHIN
        if (props.deckCollection) {
            // Update
            await pb.collection("deckcollections").update(props.deckCollection.id, {
                name: collectionTitle.value,
                description: collectionDescription.value,
            })
            useToast().add({ title: "Deck updated", color: "success" })
        } else {
            // Create
            await pb.collection("deckcollections").create(newCollection)
            useToast().add({ title: "Deck created successfully", color: "success" })
        }
    } catch (error) {
        toastError(`${error}`)
    }
    
    close()
    emit("created")
    console.log("Action done, modal closed")
}
</script>

<template>
    <UModal :title="props.deckCollection ? 'Edit Collection' : 'Create a new Collection'">
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
            <UButton color="primary" size="xl" class="w-full" @click="createCollection(close)">
                {{ props.deckCollection ? 'Update Deck' : 'Create Deck' }}
            </UButton>
        </template>
        <slot />
    </UModal>
</template>