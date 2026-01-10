<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui"

const route = useRoute()
const router = useRouter()
const items = computed<NavigationMenuItem[]>(() => [
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
	{
		label: "Log Out",
		onClick: () => {
			pb.authStore.clear()
			navigateTo("/auth/login")
		},
	},
])

const goBack = () => {
	router.back()
}
</script>

<template>
	<div>
		<UHeader mode="slideover">
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

			<UNavigationMenu :items="items" />

			<template #right>
				<UColorModeButton />

				<UButton
					color="neutral"
					variant="ghost"
					to="https://github.com/Snoilt/carter"
					target="_blank"
					icon="i-simple-icons-github"
					aria-label="GitHub"
				/>
			</template>

			<template #body>
				<UNavigationMenu :items="items" orientation="vertical" class="-mx-2.5" />
			</template>
		</UHeader>

		<slot />
	</div>
</template>
