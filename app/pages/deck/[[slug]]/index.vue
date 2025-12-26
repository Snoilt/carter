<script setup lang="ts">
const router = useRouter()
</script>

<template>
	<h1>{{ router.getRoutes() }}</h1>
</template>
