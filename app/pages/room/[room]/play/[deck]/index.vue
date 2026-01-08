<script setup lang="ts">
import type { CardsRecord } from "~/types/pb"

// const router = useRouter()
const cards = ref<CardsRecord[]>([])

// ----------------------------------------------------------------------------

const currentIndex = ref(0)
const showAnswer = ref(false)
const currentCard = computed(() => cards.value[currentIndex.value])
const isFinished = computed(() => currentIndex.value >= cards.value.length)

const handleSpacebar = () => {
	if (isFinished.value) return

	if (showAnswer.value) {
		showAnswer.value = false
		currentIndex.value++
	} else {
		showAnswer.value = true
	}
}

defineShortcuts({
	" ": handleSpacebar,
})

// ----------------------------------------------------------------------------

const fetchCards = async () => {}

console.log(fetchCards())

// ----------------------------------------------------------------------------

onMounted(() => {
	fetchCards()
})
</script>

<template>
	<div class="flex flex-col items-center justify-center min-h-screen p-4">
		<div v-if="cards.length === 0" class="text-center text-gray-500">
			Loading cards...
		</div>

		<div v-else-if="isFinished" class="text-center">
			<h2 class="text-2xl font-bold mb-4">🎉 You've finished all cards!</h2>
			<p class="text-gray-500">{{ cards.length }} cards reviewed</p>
		</div>

		<div v-else class="w-full max-w-2xl">
			<div class="mb-4 text-center text-sm text-gray-500">
				Card {{ currentIndex + 1 }} of {{ cards.length }}
			</div>

			<div
				v-if="currentCard?.question && currentCard?.solution"
				class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 min-h-64"
			>
				<div class="mb-6">
					<h3 class="text-lg font-semibold text-gray-500 mb-2">Question</h3>
					<MDC :value="currentCard?.question" />
				</div>

				<div v-if="showAnswer" class="border-t pt-6">
					<h3 class="text-lg font-semibold text-gray-500 mb-2">Answer</h3>
					<div class="text-xl">
						<MDC :value="currentCard?.solution" />
					</div>
				</div>
			</div>

			<p class="space-x-2 text-center mt-6 text-gray-400 text-sm">
				<kbd class="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">1 Again</kbd>
				<kbd class="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">2 Hard</kbd>
				<kbd class="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">3 Good</kbd>
				<kbd class="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">4 Easy</kbd>
				<kbd class="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">Space</kbd>
				{{ showAnswer ? "for next card" : "to reveal answer" }}
			</p>
		</div>
	</div>
</template>
