<script setup lang="ts">
const props = defineProps<{
	type: "none" | "error"
	errorMessage?: string | null
}>()
</script>

<template>
	<div
		v-if="props.type === 'error' && props.errorMessage"
		class="text-red-500 text-center"
	>
		{{ props.errorMessage }}
	</div>
	<div v-else-if="props.type === 'none'" class="text-center">
		<h2 class="text-2xl font-bold mb-2">All caught up 🎉</h2>
		<p class="text-gray-500">No new or due cards in this deck.</p>
	</div>
	<div v-else />
</template>
