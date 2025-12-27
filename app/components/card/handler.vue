<script setup lang="ts">
const open = ref(false)

defineExpose({
	open,
})
</script>

<template>
	<USlideover
		v-model:open="open"
		title="Card Name"
		aria-describedby="card-editor-slideover"
	>
		<template #body>
			<div class="space-y-8">
				<div>
					<h1 class="text-2xl font-bold">Front</h1>
					<CardEditor />
				</div>
				<div>
					<h1 class="text-2xl font-bold">Back</h1>
					<CardEditor />
				</div>
				<UButton size="xl" block>Save</UButton>
			</div>
		</template>
	</USlideover>
</template>
