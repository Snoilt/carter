<script setup lang="ts">
import { z } from "zod"

const toast = useToast()

const schema = z
	.object({
		email: z.email("Invalid email"),
		password: z.string().min(8, "Password should be at least 8 characters"),
		passwordConfirm: z.string(),
		userName: z.string().min(3, "User Name should be at least 3 characters"),
	})
	.refine((data) => data.password === data.passwordConfirm, {
		message: "Passwords don't match",
		path: ["passwordConfirm"],
	})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
	email: "",
	password: "",
	passwordConfirm: "",
	userName: "",
})

// -------------------------------------------------------------------------------

const register = async () => {
	try {
		if (!state.email || !state.password) {
			toast.add({
				title: "Error",
				description: "Email and Password are required",
				color: "error",
			})
			throw new Error("Invalid email or password format")
		}

		await pb.collection("users").create({
			email: state.email,
			password: state.password,
			passwordConfirm: state.passwordConfirm,
			name: state.userName,
		})

		await pb.collection("users").authWithPassword(state.email, state.password)
		navigateTo("/dashboard")

		useToast().add({
			title: "Registration successful",
			color: "success",
		})
	} catch (error) {
		toast.add({
			title: "Error",
			description: "Something went wrong",
			color: "error",
		})
		console.log(error)
	}
}

// -------------------------------------------------------------------------------

defineShortcuts({
	meta_o: () => fillRegisterForm(state),
})
</script>

<template>
	<MaxContainer>
		<UCard class="m-auto w-full max-w-md p-6" variant="subtle">
			<UForm
				class="grid grid-cols-[18em] align-middle justify-center space-y-4 m-auto"
				:state="state"
				:schema="schema"
				@submit="register"
			>
				<h1 class="font-bold text-2xl">Create your Account</h1>
				<UFormField name="email">
					<UInput
						v-model="state.email"
						class="w-full"
						type="email"
						placeholder="E-Mail"
						size="xl"
					/>
				</UFormField>
				<UFormField name="userName">
					<UInput
						v-model="state.userName"
						type="text"
						placeholder="Your Name"
						size="xl"
						class="w-full"
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
				<UFormField name="passwordConfirm">
					<UInput
						v-model="state.passwordConfirm"
						type="password"
						placeholder="Confirm Password"
						size="xl"
						class="w-full"
					/>
				</UFormField>

				<UButton type="submit" color="primary" size="xl">Register</UButton>

				<USeparator />

				<p>Or register with an Account</p>
				<UButton variant="outline" size="xl"
					><Icon size="20" name="uil:apple" />Register with Apple</UButton
				>
				<UButton variant="outline" size="xl"
					><Icon size="20" name="uil:google" />Register with Google</UButton
				>
				<UButton variant="outline" size="xl"
					><Icon size="20" name="uil:github" />Register with Github</UButton
				>

				<USeparator />

				<p>
					Already have an Account?
					<NuxtLink to="/auth/login" class="text-purpleish-500">Log in</NuxtLink>
				</p>
			</UForm>
		</UCard>
	</MaxContainer>
</template>
