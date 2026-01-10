<script setup lang="ts">
type FsrsState = {
	stability: number
	difficulty: number
	lapses: number
	state: string
	lastReviewedAt: string | null
}

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

const props = defineProps<{
	nextFsrs?: FsrsState | null
	review?: ReviewResponse | null
}>()

const fmt = (v: unknown) => (v === null || v === undefined || v === "" ? "—" : String(v))
</script>

<template>
	<UCard>
		<div class="space-y-6">
			<div>
				<h4 class="text-sm font-semibold text-gray-600 mb-2">FSRS (next)</h4>
				<div v-if="props.nextFsrs" class="grid grid-cols-2 gap-y-2 text-sm">
					<div class="text-gray-500">Stability</div>
					<div class="font-mono">{{ fmt(props.nextFsrs.stability) }}</div>
					<div class="text-gray-500">Difficulty</div>
					<div class="font-mono">{{ fmt(props.nextFsrs.difficulty) }}</div>
					<div class="text-gray-500">Lapses</div>
					<div class="font-mono">{{ fmt(props.nextFsrs.lapses) }}</div>
					<div class="text-gray-500">State</div>
					<div class="font-mono">{{ fmt(props.nextFsrs.state) }}</div>
					<div class="text-gray-500">Last Reviewed</div>
					<div class="font-mono">{{ fmt(props.nextFsrs.lastReviewedAt) }}</div>
				</div>
				<div v-else class="text-sm text-gray-500">No FSRS state available.</div>
			</div>

			<div>
				<h4 class="text-sm font-semibold text-gray-600 mb-2">Review result</h4>
				<div v-if="props.review" class="grid grid-cols-2 gap-y-2 text-sm">
					<div class="text-gray-500">User Card</div>
					<div class="font-mono">{{ fmt(props.review.userCardId) }}</div>
					<div class="text-gray-500">Attempt</div>
					<div class="font-mono">{{ fmt(props.review.attemptId) }}</div>
					<div class="text-gray-500">Rating</div>
					<div class="font-mono">{{ fmt(props.review.rating) }}</div>
					<div class="text-gray-500">Due At</div>
					<div class="font-mono">{{ fmt(props.review.dueAt) }}</div>
					<div class="text-gray-500">Stability</div>
					<div class="font-mono">{{ fmt(props.review.stability) }}</div>
					<div class="text-gray-500">Difficulty</div>
					<div class="font-mono">{{ fmt(props.review.difficulty) }}</div>
					<div class="text-gray-500">Lapses</div>
					<div class="font-mono">{{ fmt(props.review.lapses) }}</div>
					<div class="text-gray-500">State</div>
					<div class="font-mono">{{ fmt(props.review.state) }}</div>
					<div class="text-gray-500">Last Reviewed</div>
					<div class="font-mono">{{ fmt(props.review.lastReviewedAt) }}</div>
				</div>
				<div v-else class="text-sm text-gray-500">No review yet.</div>
			</div>
		</div>
	</UCard>
</template>
