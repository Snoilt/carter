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

// ----------------------------------------------------------------------------

type ReviewResponse = {
	userCardId: string
	attemptId: string
	rating: number
	dueAt: string | null
	stability: number
	difficulty: number
	lapses: number
	state: string
	lastReviewedAt: string | null
}

// ----------------------------------------------------------------------------

const route = useRoute()
const deckId = computed(() => String(route.params.deck || ""))

const loading = ref(true)
const state = ref<NextResponse["type"] | null>()
const card = ref<NextResponse["card"] | null>()
const userCardId = ref<string | null>()
const fsrs = ref<NextResponse["fsrs"] | null>()

const showAnswer = ref(false)
const errorMessage = ref<string | null>()
const showStats = ref(false)
const nextPayload = ref<NextResponse | undefined>(undefined)
const reviewPayload = ref<ReviewResponse | undefined>(undefined)

// ----------------------------------------------------------------------------

const fetchNext = async () => {
	errorMessage.value = undefined
	loading.value = true
	showAnswer.value = false
	try {
		const response = (await pb.send(`/api/learn/next/${deckId.value}`, {
			method: "GET",
		})) as NextResponse
		nextPayload.value = response
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

// ----------------------------------------------------------------------------

const rate = async (rating: 1 | 2 | 3 | 4) => {
	if (!userCardId.value) return
	try {
		const reviewResponse = (await pb.send(`/api/learn/review`, {
			method: "POST",
			body: JSON.stringify({
				userCardId: userCardId.value,
				rating,
				attemptId: crypto.randomUUID(),
			}),
		})) as ReviewResponse
		reviewPayload.value = reviewResponse
		await fetchNext()
	} catch (error) {
		errorMessage.value = `${error}`
	}
}

// ----------------------------------------------------------------------------

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
	d: () => (showStats.value = !showStats.value),
})

// ----------------------------------------------------------------------------

onMounted(() => {
	fetchNext()
})
</script>

<template>
	<MaxContainer class="w-full p-4">
		<div class="grid place-items-center min-h-[calc(100svh-64px)] w-full">
			<div class="w-full">
				<div v-if="errorMessage" class="text-red-500 mb-4 text-center">
					{{ errorMessage }}
				</div>

				<UContainer class="max-w-2xl mx-auto pb-24">
					<Transition name="card-fade" mode="out-in">
						<div v-if="state !== null" :key="card?.id || state">
							<PlayStateMessage v-if="state === 'none'" type="none" />
							<PlayCard v-else :card="card || null" :show-answer="showAnswer" />
						</div>
					</Transition>

					<div v-if="showStats" class="mt-6">
						<PlayNerdstats :next-fsrs="nextPayload?.fsrs" :review="reviewPayload" />
					</div>
				</UContainer>

				<div
					v-if="state !== 'none'"
					class="fixed bottom-20 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4 z-10"
				>
					<div v-if="!showAnswer" class="flex items-center justify-center">
						<UTooltip text="Press" :kbds="['space']">
							<UButton size="lg" variant="subtle" @click="showAnswer = true"
								>Show answer</UButton
							>
						</UTooltip>
					</div>
					<div v-else>
						<PlayRatingControls :disabled="loading" @rate="rate" />
					</div>
				</div>
			</div>
		</div>
	</MaxContainer>
</template>

<style scoped>
.card-fade-enter-active,
.card-fade-leave-active {
	transition:
		opacity 100ms ease,
		transform 100ms ease;
}
.card-fade-enter-from,
.card-fade-leave-to {
	opacity: 0;
	transform: translateY(8px) scale(0.99);
}
.card-fade-enter-to,
.card-fade-leave-from {
	opacity: 1;
	transform: translateY(0) scale(1);
}
</style>
