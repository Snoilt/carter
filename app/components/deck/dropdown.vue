<script setup lang="ts">
const items = ref([
	{ label: "Edit", icon: "lucide:pencil" },
	{ label: "Share", icon: "lucide:share-2" },
	{ label: "Delete", icon: "lucide:trash" },
])
</script>

<template>
	<UDropdownMenu :ui="{ content: 'w-40' }" :items="items">
		<UButton variant="ghost" size="sm" icon="lucide:more-horizontal" />
	</UDropdownMenu>
</template>
