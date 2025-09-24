<script setup lang="ts">
import { z } from "zod"
import type { FormSubmitEvent } from "@nuxt/ui"

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
		<UForm
            class="grid align-middle justify-center max-w-md mx-auto my-40 space-y-4"
			:state="state"
			:schema="schema"
			@submit="
				(e: FormSubmitEvent<schema>) => {
					/* handle submit */
				}
			"
		>
			<UFormGroup label="E-Mail" name="email">
				<UInput v-model="state.email" type="email" placeholder="E-Mail Adresse" />
			</UFormGroup>
			<UFormGroup label="Passwort" name="password">
				<UInput v-model="state.password" type="password" placeholder="Passwort" />
			</UFormGroup>
			<UButton type="submit" color="primary">Einloggen</UButton>
		</UForm>
</template>
