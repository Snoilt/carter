<script setup lang="ts">
import type { CardsRecord, DecksRecord } from "~/types/pb"

const open = ref(false)
defineExpose({
	open,
})

const props = defineProps<{
	card?: CardsRecord
	deck: DecksRecord
}>()

const emit = defineEmits(["cardUpdate"])

const frontContent = ref<string>()
const backContent = ref<string>()

// ----------------------------------------------------------------------------

if (props.card) {
	frontContent.value = props.card.question || ""
	backContent.value = props.card.solution || ""
}

// ----------------------------------------------------------------------------

const saveCard = async () => {
	if (props.card) {
		await pb.collection("cards").update(props.card.id, {
			question: frontContent.value,
			solution: backContent.value,
		})
	} else {
		await pb.collection("cards").create({
			question: frontContent.value,
			solution: backContent.value,
			deck: props.deck.id,
		})
	}

	emit("cardUpdate")
	open.value = false
}

// ----------------------------------------------------------------------------

const deleteCard = async () => {
	if (!props.card) return

	try {
		await pb.collection("cards").delete(props.card.id)
		useToast().add({
			title: "Card deleted successfully",
			color: "success",
		})
		emit("cardUpdate")
		open.value = false
	} catch (error) {
		toastError(`${error}`)
	}
}
</script>
<template>
	<USlideover
		v-model:open="open"
		title="Card Name"
		aria-describedby="card-editor-slideover"
	>
		<slot v-if="!props.card"></slot>
		<UButton v-if="props.card" icon="lucide:pencil-line" />
		<template #body>
			<div class="space-y-8">
				<div>
					<h1 class="text-2xl font-bold">Front</h1>
					<CardEditor v-model="frontContent" />
				</div>
				<div>
					<h1 class="text-2xl font-bold">Back</h1>
					<CardEditor v-model="backContent" />
				</div>
				<div class="flex gap-2">
					<UButton
						v-if="props.card"
						icon="lucide:trash"
						size="xl"
						variant="subtle"
						@click="deleteCard"
					/>
					<UButton size="xl" block @click="saveCard">Save</UButton>
				</div>
			</div>
		</template>
	</USlideover>
</template>
