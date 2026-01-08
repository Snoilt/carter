<script setup lang="ts">
const review = async () => {
	try {
		console.log(
			await pb.send("/api/learn/review", {
				method: "POST",
				body: JSON.stringify({
					userCardId: "dcsfzgeel4ym54x",
					rating: 4,
					attemptId: "testattemptid21",
				}),
			}),
		)
	} catch (error) {
		console.error("Failed to review card:", error)
	}
}

//DECK ID AUSFÜLLEN FÜR TESTEN
const nextCard = async () => {
	try {
		const response = await pb.send(`/api/learn/next/wgq3p3dgkri7e97`, {
			method: "GET",
		})
		console.log(response)
	} catch (error) {
		console.error("Failed to review card:", error)
	}
}

const goEndPoint = async () => {
	try {
		const response = await pb.send(`/api/learn/review`, {
			method: "GET",
		})
		console.log(response)
	} catch (error) {
		console.error("Failed to review card:", error)
	}
}
</script>

<template>
	<div>
		<UButton @click="review">Test review endpoint</UButton>
		<UButton @click="nextCard">Test next Card endpoint</UButton>
		<UButton @click="goEndPoint">Test review GET endpoint</UButton>
	</div>
</template>
