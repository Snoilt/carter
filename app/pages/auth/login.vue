<script setup lang="ts">
import * as z from "zod"

const toast = useToast()

const schema = z.object({
	email: z.email("invalid email"),
	password: z.string().min(8, "Password should be at least 8 characters "),
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
	email: "",
	password: "",
})

// ------------------------------------------------------------------------------

const OAuth = (provider: "google" | "apple" | "github") => {
	pb.collection("users").authWithOAuth2({
		provider: provider,
	})
}

// ------------------------------------------------------------------------------

const login = async () => {
	try {
		if (typeof state.email !== "string" || typeof state.password !== "string") {
			throw new TypeError("Invalid email or password format")
		}
		await pb.collection("users").authWithPassword(state.email, state.password)
		navigateTo("/dashboard")

		toast.add({
			title: "Login successful",
			color: "success",
		})
	} catch {
		toast.add({
			title: "Error",
			description: "Something went wrong",
			color: "error",
		})
	}
}
</script>

<template>
	<MaxContainer>
		<UCard class="m-auto w-full max-w-md p-6" variant="subtle">
			<UForm
				class="grid grid-cols-[18em] align-middle justify-center space-y-4 m-auto"
				:state="state"
				:schema="schema"
				@submit="login"
			>
				<h1 class="font-bold text-2xl">Log in with your Email</h1>
				<UFormField name="email">
					<UInput
						v-model="state.email"
						class="w-full"
						type="email"
						placeholder="E-Mail"
						size="xl"
					/>
				</UFormField>
				<UFormField name="password">
					<UInput
						v-model="state.password"
						type="password"
						placeholder="Password"
						size="xl"
						class="w-full"
					/>
				</UFormField>
				<UButton type="submit" color="primary" size="xl">Log in</UButton>

				<USeparator />

				<p>Or log in with an existing Account</p>
				<UButton variant="outline" size="xl" @click="OAuth('apple')"
					><Icon size="20" name="uil:apple" />Log in with Apple</UButton
				>
				<UButton variant="outline" size="xl" @click="OAuth('google')"
					><Icon size="20" name="uil:google" />Log in with Google</UButton
				>
				<UButton variant="outline" size="xl" @click="OAuth('github')"
					><Icon size="20" name="uil:github" />Log in with Github</UButton
				>

				<USeparator />

				<p>
					Dont have an Account?
					<NuxtLink to="/auth/register" class="text-purpleish-500">Register Now</NuxtLink>
				</p>
			</UForm>
		</UCard>
	</MaxContainer>
</template>
