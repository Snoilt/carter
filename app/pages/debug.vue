<script setup lang="ts">
const review = async () => {
	try {
		await pb.send("/api/card/review", {
			method: "POST",
			body: JSON.stringify({
				cardId: "example card id",
				rating: 3,
			}),
		})
	} catch (error) {
		console.error("Failed to review card:", error)
	}
}

//DECK ID AUSFÜLLEN FÜR TESTEN
const nextCard = async () => {
	try {
		await pb.send("/api/card/next/{enter deck id here}", {
			method: "GET",
		})
	} catch (error) {
		console.error("Failed to review card:", error)
	}
}
</script>

<template>
	<div>
		<UButton @click="review">Test review endpoint</UButton>
		<UButton @click="nextCard">Test next Card endpoint</UButton>
	</div>
</template>
