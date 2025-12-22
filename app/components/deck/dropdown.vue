<script setup lang="ts">
import { removeCollection } from "~/composables/database/remove-collection"
import type { DeckcollectionsResponse } from "~/types/pb"

const emit = defineEmits(["action"]) 
const user = new User()

const props = defineProps<{
    collection: DeckcollectionsResponse
}>()

// 1. Wir erstellen eine Referenz ("Griff"), um den Creator anzufassen
const open = ref(false)

const items = computed(() => {
    return [
        {
            label: "Edit",
            icon: "lucide:pencil",
            show: user.getRole(props.collection) >= 1,
            // 2. JETZT IST ES EIN BEFEHL (wie bei Remove)
            // Wir sagen direkt: "Creator, öffne dich!"
            onSelect: () => { 
                open.value = true
                emit("action")
            }
        },
        { label: "Share", icon: "lucide:share-2", show: true },
        {
            label: "Remove",
            icon: "lucide:trash",
            show: true,
            onSelect: async () => {
                await removeCollection(props.collection)
                emit("action")
            },
        },
    ]
})
</script>
<template>
    <div class="flex items-center">
        <DeckCreator 
            v-model:open="open" 
            :deck-collection="props.collection"
            @created="emit('action')" 
        />

        <UDropdownMenu :ui="{ content: 'w-40' }" :items="items">
            <UButton variant="ghost" size="sm" icon="lucide:more-horizontal" />
        </UDropdownMenu>
    </div>
</template>