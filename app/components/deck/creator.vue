<script setup lang="ts">
import type { DeckcollectionsRecord, DeckcollectionsResponse } from "~/types/pb"

const emit = defineEmits(["created", "update:modelValue"]) // Wichtig für v-model

const props = defineProps<{
    deckCollection?: DeckcollectionsResponse,
    modelValue?: boolean // Das ist der Standard-Name für v-model
}>()

const user = new User()

// Interne Steuerung des Modals
// Wir starten mit dem Wert, der von außen kommt, oder false
const isOpen = ref(props.modelValue || false)

const collectionTitle = ref("")
const collectionDescription = ref("")
const emailList = ref<string[]>([])

// 1. WATCHER: Wenn sich die Variable draußen (im Dropdown) ändert, ändern wir sie auch hier drinnen
watch(() => props.modelValue, (value) => {
    isOpen.value = value || false
})

// 2. WATCHER: Wenn wir das Fenster hier drinnen schließen, sagen wir dem Dropdown Bescheid
watch(isOpen, (value) => {
    emit("update:modelValue", value)
})

// Daten füllen beim Öffnen/Ändern der Collection
watch(() => props.deckCollection, (newValue) => {
    if (newValue) {
        collectionTitle.value = newValue.name
        collectionDescription.value = newValue.description
    } else {
        collectionTitle.value = ""
        collectionDescription.value = ""
        emailList.value = []
    }
}, { immediate: true })

async function createCollection(closeCallback?: () => void) {
    if (!user) throw new Error("User must be logged in")

    const newCollection: DeckcollectionsRecord = {
        id: "", user: [user.id], creator: user.id,
        name: collectionTitle.value, description: collectionDescription.value,
    }

    try {
        if (props.deckCollection) {
            await pb.collection("deckcollections").update(props.deckCollection.id, {
                name: collectionTitle.value, description: collectionDescription.value,
            })
            useToast().add({ title: "Deck updated", color: "success" })
        } else {
            await pb.collection("deckcollections").create(newCollection)
            useToast().add({ title: "Deck created", color: "success" })
        }

        emit("created")
        
        // Modal schließen
        if (closeCallback) closeCallback()
        isOpen.value = false // Setzt auch das v-model im Parent auf false

    } catch (error) {
        console.error(error)
    }
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