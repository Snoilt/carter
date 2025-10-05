<script setup lang="ts">
import { removeCollection } from "~/composables/database/remove-collection"
import type { DeckcollectionsResponse } from "~/types/pb"

const user = new User()

const props = defineProps<{
	collection: DeckcollectionsResponse
}>()

const items = computed(() => {
	const baseItems = [
		{
			label: "Edit",
			icon: "lucide:pencil",
			show: user.getRole(props.collection) >= 1,
		},
		{ label: "Share", icon: "lucide:share-2", show: true },
		{
			label: "Remove",
			icon: "lucide:trash",
			show: true,
			onSelect: (_event: Event) => removeCollection(props.collection),
		},
	]

	return baseItems.filter((item) => item.show !== false)
})
</script>

<template>
	<UDropdownMenu :ui="{ content: 'w-40' }" :items="items">
		<UButton variant="ghost" size="sm" icon="lucide:more-horizontal" />
	</UDropdownMenu>
</template>
