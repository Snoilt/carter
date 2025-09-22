<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui"

const route = useRoute()

const items = computed<NavigationMenuItem[]>(() => [
	{
		label: "Login",
		to: "/login",
		active: route.path.startsWith("/login"),
	},
	{
		label: "Register",
		to: "/register",
		active: route.path.startsWith("/register"),
	},
	{
		label: "Figma",
		to: "https://go.nuxt.com/figma-ui",
		target: "_blank",
	},
])
</script>

<template>
	<UApp>
		<UHeader mode="slideover">
			<template #title>
				<h1>Carter</h1>
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

		<UMain>
			<NuxtLayout>
				<NuxtPage />
			</NuxtLayout>
		</UMain>

		<UFooter />
	</UApp>
</template>
