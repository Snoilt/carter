<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui"

const route = useRoute()
const router = useRouter()

const isLoggedIn = ref(pb.authStore.isValid)
pb.authStore.onChange(() => {
	isLoggedIn.value = pb.authStore.isValid
})

const items = computed<NavigationMenuItem[]>(() => {
	if (isLoggedIn.value) return []
	return [
		{
			label: "Login",
			to: "/auth/login",
			active: route.path.startsWith("/auth/login"),
		},
		{
			label: "Register",
			to: "/auth/register",
			active: route.path.startsWith("/auth/register"),
		},
	]
})

const goBack = () => {
	router.back()
}
</script>

<template>
	<div>
		<UHeader :toggle="!isLoggedIn" mode="slideover">
			<template #title>
				<UButton
					v-if="route.path.startsWith('/room/')"
					variant="soft"
					class=""
					icon="lucide:chevron-left"
					label="Back"
					@click="goBack"
				/>
			</template>

			<UNavigationMenu v-if="!isLoggedIn" :items="items" />

			<template #right>
				<UColorModeButton />

				<UserDropdown v-if="isLoggedIn" />
			</template>

			<template #body>
				<UNavigationMenu
					v-if="!isLoggedIn"
					:items="items"
					orientation="vertical"
					class="-mx-2.5"
				/>
			</template>
		</UHeader>

		<slot />
	</div>
</template>
