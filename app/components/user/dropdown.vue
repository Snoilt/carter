<script setup lang="ts">
const user = computed(() => pb.authStore.record)

const name = computed(() => user.value?.name || "User")
const email = computed(() => user.value?.email || "")
const avatarUrl = computed(() => {
	const record = user.value
	const avatar = record?.avatar
	return avatar ? pb.files.getURL(record, avatar) : undefined
})

const items = computed(() => [
	[
		{
			label: name.value,
			icon: "lucide:user",
			onSelect: () => {},
		},
		{
			label: email.value,
			icon: "lucide:at-sign",
			onSelect: () => {},
		},
	],
	[
		{
			label: "Log out",
			icon: "lucide:log-out",
			color: "error",
			onSelect: () => {
				pb.authStore.clear()
				navigateTo("/auth/login")
			},
		},
	],
])
</script>

<template>
	<UDropdownMenu :ui="{ content: 'w-56' }" :items="items">
		<UAvatar :src="avatarUrl" :alt="name" size="md" />
	</UDropdownMenu>
</template>
