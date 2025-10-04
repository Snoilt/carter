<script setup lang="ts">
import type { DecksResponse } from "~/types/pb"

const props = defineProps<{
	deck: DecksResponse
}>()

const items = computed(() => {
	const baseItems = [
		{ label: "Edit", icon: "lucide:pencil", show: canEdit(props.deck) },
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
