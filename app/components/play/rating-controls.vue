<script setup lang="ts">
const props = withDefaults(defineProps<{ disabled?: boolean }>(), { disabled: false })
const emit = defineEmits<{ (event: "rate", value: 1 | 2 | 3 | 4): void }>()
</script>

<template>
	<div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
		<UButton
			size="xl"
			:disabled="props.disabled"
			variant="soft"
			block
			@click="emit('rate', 1)"
		>
			<span class="font-semibold">1</span>
			<span class="ml-2">Again</span>
		</UButton>
		<UButton
			size="xl"
			:disabled="props.disabled"
			variant="soft"
			block
			@click="emit('rate', 2)"
		>
			<span class="font-semibold">2</span>
			<span class="ml-2">Hard</span>
		</UButton>
		<UButton
			size="xl"
			:disabled="props.disabled"
			variant="soft"
			block
			@click="emit('rate', 3)"
		>
			<span class="font-semibold">3</span>
			<span class="ml-2">Good</span>
		</UButton>
		<UButton
			size="xl"
			:disabled="props.disabled"
			variant="soft"
			block
			@click="emit('rate', 4)"
		>
			<span class="font-semibold">4</span>
			<span class="ml-2">Easy</span>
		</UButton>
	</div>
</template>
