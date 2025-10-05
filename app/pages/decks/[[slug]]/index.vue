<script setup lang="ts">
const route = useRoute()
</script>

<template>
	<h1>Collection: {{ route.params.slug }}</h1>
</template>
