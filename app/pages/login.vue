<script setup lang="ts">
import { z } from "zod"
// import type { FormSubmitEvent } from "@nuxt/ui"

const schema = z.object({
	email: z.email(),
	password: z.string().min(6),
})

type schema = z.output<typeof schema>

const state = reactive<Partial<schema>>({
	email: undefined,
	password: undefined,
})
</script>

<template>
	<!-- <h1>Das ist die Seite zum einloggen</h1> -->
	<div
		class="flex min-h-[calc(100vh-var(--ui-header-height))] justify-center items-center w-full space-y-4"
	>
		<UForm
			class="grid align-middle justify-center max-w-md mx-auto space-y-4"
			:state="state"
			:schema="schema"
		>
			<h1 class="font-bold text-2xl">Log in with your Email</h1>
			<UInput v-model="state.email" type="email" placeholder="E-Mail Adresse" />

			<!-- <UInput v-model="state.password" type="password" placeholder="Passwort" /> -->

			<UButton type="submit" color="primary">Log in</UButton>
			<p class="text-sm">Or log in with an existing Account</p>
			<UButton variant="outline"
				><Icon size="20" name="uil:apple" />Log in with Apple</UButton
			>
			<UButton variant="outline"
				><Icon size="20" name="uil:google" />Log in with Google</UButton
			>
			<UButton variant="outline"
				><Icon size="20" name="uil:github" />Log in with Github</UButton
			>
		</UForm>
	</div>
</template>
