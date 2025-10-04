<script setup lang="ts">
const route = useRoute()
</script>

<template>
	<h1>Deck: {{ route.params.slug }}</h1>
</template>
