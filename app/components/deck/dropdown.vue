<script setup lang="ts">
import type { DeckcollectionsResponse } from "~/types/pb"

const props = defineProps<{
	collection: DeckcollectionsResponse
}>()

const items = computed(() => {
	const baseItems = [
		{
			label: "Edit",
			icon: "lucide:pencil",
			show: useUser().getRole(props.collection) >= 1,
		},
		{ label: "Share", icon: "lucide:share-2", show: true },
		{ label: "Remove", icon: "lucide:trash", show: true },
	]

	return baseItems.filter((item) => item.show !== false)
})
</script>

<template>
	<UDropdownMenu :ui="{ content: 'w-40' }" :items="items">
		<UButton variant="ghost" size="sm" icon="lucide:more-horizontal" />
	</UDropdownMenu>
</template>
