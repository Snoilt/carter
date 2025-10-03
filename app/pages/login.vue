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
	<UContainer class="min-h-[calc(100vh-var(--ui-header-height))] flex">
		<UForm
			class="grid align-middle justify-center space-y-4 m-auto"
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
	</UContainer>
</template>
