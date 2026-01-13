<script setup lang="ts">
const props = defineProps<{
	card: { id: string; question: string; solution: string; deck: string } | null
	showAnswer: boolean
}>()
</script>

<template>
	<UCard v-if="props.card" variant="subtle" class="min-h-64">
		<div class="mb-6">
			<h3 class="text-lg font-semibold text-gray-500 mb-2">Question</h3>
			<MDC :value="props.card?.question || ''" />
		</div>

		<div
			class="border-t overflow-hidden transition-all duration-300 ease-in-out"
			:class="
				props.showAnswer
					? 'pt-6 max-h-250 opacity-100 border-gray-200 dark:border-gray-700'
					: 'pt-0 max-h-0 opacity-0 border-transparent'
			"
		>
			<h3 class="text-lg font-semibold text-gray-500 mb-2">Answer</h3>
			<div class="text-lg">
				<MDC :value="props.card?.solution || ''" />
			</div>
		</div>
	</UCard>
</template>
