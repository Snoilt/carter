<script setup lang="ts">
import { useRoute } from "vue-router"

type NextResponse = {
	type: "new" | "due" | "none"
	deckId: string
	now: string
	userCard?: { id: string; dueAt: string | null }
	card?: { id: string; question: string; solution: string; deck: string }
	fsrs?: {
		stability: number
		difficulty: number
		lapses: number
		state: string
		lastReviewedAt: string | null
	}
}

const route = useRoute()
const deckId = computed(() => String(route.params.deck || ""))

const loading = ref(true)
const state = ref<NextResponse["type"] | null>()
const card = ref<NextResponse["card"] | null>()
const userCardId = ref<string | null>()
const fsrs = ref<NextResponse["fsrs"] | null>()

const showAnswer = ref(false)
const errorMessage = ref<string | null>()

const fetchNext = async () => {
	errorMessage.value = undefined
	loading.value = true
	showAnswer.value = false
	try {
		const response = (await pb.send(`/api/learn/next/${deckId.value}`, {
			method: "GET",
		})) as NextResponse
		state.value = response.type
		if (response.type === "new" || response.type === "due") {
			card.value = response.card
			userCardId.value = response.userCard?.id
			fsrs.value = response.fsrs
		} else {
			card.value = undefined
			userCardId.value = undefined
			fsrs.value = undefined
		}
	} catch (error) {
		errorMessage.value = `${error}`
	} finally {
		loading.value = false
	}
}

const rate = async (rating: 1 | 2 | 3 | 4) => {
	if (!userCardId.value) return
	try {
		await pb.send(`/api/learn/review`, {
			method: "POST",
			body: JSON.stringify({
				userCardId: userCardId.value,
				rating,
				attemptId: crypto.randomUUID(),
			}),
		})
		await fetchNext()
	} catch (error) {
		errorMessage.value = `${error}`
	}
}

const handleSpacebar = () => {
	if (loading.value || state.value === "none") return
	showAnswer.value = !showAnswer.value
}

defineShortcuts({
	" ": handleSpacebar,
	"1": () => (showAnswer.value ? rate(1) : (showAnswer.value = true)),
	"2": () => (showAnswer.value ? rate(2) : (showAnswer.value = true)),
	"3": () => (showAnswer.value ? rate(3) : (showAnswer.value = true)),
	"4": () => (showAnswer.value ? rate(4) : (showAnswer.value = true)),
})

onMounted(() => {
	fetchNext()
})
</script>

<template>
	<div class="flex flex-col items-center justify-center min-h-screen p-4">
		<div v-if="errorMessage" class="text-red-500 mb-4">{{ errorMessage }}</div>

		<div v-if="loading" class="text-center text-gray-500">Loading card...</div>

		<div v-else-if="state === 'none'" class="text-center">
			<h2 class="text-2xl font-bold mb-2">All caught up 🎉</h2>
			<p class="text-gray-500">No new or due cards in this deck.</p>
		</div>

		<div v-else class="w-full max-w-2xl">
			<div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 min-h-64">
				<div class="mb-6">
					<h3 class="text-lg font-semibold text-gray-500 mb-2">Question</h3>
					<MDC :value="card?.question || ''" />
				</div>

				<div v-if="showAnswer" class="border-t pt-6">
					<h3 class="text-lg font-semibold text-gray-500 mb-2">Answer</h3>
					<div class="text-xl">
						<MDC :value="card?.solution || ''" />
					</div>
				</div>
			</div>

			<div v-if="!showAnswer" class="flex items-center justify-center gap-2 mt-6">
				<UButton size="lg" variant="subtle" @click="showAnswer = true"
					>Show answer</UButton
				>
			</div>

			<div v-else class="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-6">
				<UButton variant="soft" block @click="rate(1)">
					<span class="font-semibold">1</span>
					<span class="ml-2">Again</span>
				</UButton>
				<UButton variant="soft" block @click="rate(2)">
					<span class="font-semibold">2</span>
					<span class="ml-2">Hard</span>
				</UButton>
				<UButton variant="soft" block @click="rate(3)">
					<span class="font-semibold">3</span>
					<span class="ml-2">Good</span>
				</UButton>
				<UButton variant="soft" block @click="rate(4)">
					<span class="font-semibold">4</span>
					<span class="ml-2">Easy</span>
				</UButton>
			</div>
		</div>
	</div>
</template>
