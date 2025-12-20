<script setup lang="ts">
import { removeCollection } from "~/composables/database/remove-collection"
import type { DeckcollectionsResponse } from "~/types/pb"

const emit = defineEmits(["action"])
const user = new User()

const props = defineProps<{
    collection: DeckcollectionsResponse
}>()

const isEditOpen = ref(false)

const items = computed(() => {
    return [
        {
            label: "Edit",
            icon: "lucide:pencil",
            show: user.getRole(props.collection) >= 1,
            // JETZT GEHT DAS: Einfach die Funktion aufrufen!
            onSelect: () => { 
                isEditOpen.value = true
            }
        },
        { label: "Share", icon: "lucide:share-2", show: true },
        {
            label: "Remove",
            icon: "lucide:trash",
            show: true,
            onSelect: () => {
                removeCollection(props.collection)
                emit("action")
            },
        },
    ]
})
</script>

<template>
    <UDropdownMenu :ui="{ content: 'w-40' }" :items="items">
        <DeckCreator :deck-collection="props.collection">
				<UButton variant="outline" icon="lucide:pencil" size="xl" class="justify-center"
					>Edit</UButton
				>
			</DeckCreator>
        <UButton variant="ghost" size="sm" icon="lucide:more-horizontal" />
    </UDropdownMenu>
</template>