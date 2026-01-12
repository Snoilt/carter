<script setup lang="ts">
import { removeCollection } from "~/composables/database/remove-collection"
import type { RoomsRecord } from "~/types/pb"

const emit = defineEmits(["action"])

const user = new User()

const props = defineProps<{
	room: RoomsRecord
}>()

const isModalOpen = ref(false)

const items = computed(() => {
	const baseItems = [
		{
			label: "Edit",
			icon: "lucide:pencil",
			show: user.getRole(props.room) >= 1,
			onSelect: (_event: Event) => {
				isModalOpen.value = true
			},
		},
		{ label: "Share", icon: "lucide:share-2", show: true },
		{
			label: "Remove",
			icon: "lucide:trash",
			show: true,
			onSelect: (_event: Event) => {
				removeCollection(props.room)
				emit("action")
				console.log("Remove action selected")
			},
		},
	]

	return baseItems.filter((item) => item.show !== false)
})
</script>

<template>
	<RoomCreator
		v-model:open="isModalOpen"
		:room="room"
		@collections-updated="emit('action')"
	/>
	<UDropdownMenu :ui="{ content: 'w-40' }" :items="items">
		<UButton variant="ghost" size="sm" icon="lucide:more-horizontal" />
	</UDropdownMenu>
</template>
