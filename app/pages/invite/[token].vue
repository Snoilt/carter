<script setup lang="ts">
import { onMounted, ref, computed } from "vue"
import { useRoute, useRouter } from "#imports"

type PreviewResponse = {
	valid: boolean
	reason?: string
	room?: { id: string; name?: string }
	expiresAt?: string | Date
	requiresAuth?: boolean
}

const route = useRoute()
const router = useRouter()
const token = computed(() => route.params.token as string)

const loading = ref(true)
const accepting = ref(false)
const preview = ref<PreviewResponse | null>()
const error = ref<string | null>()

const isLoggedIn = computed(() => {
	try {
		return Boolean(pb?.authStore?.isValid)
	} catch {
		return false
	}
})

async function loadPreview() {
	loading.value = true
	error.value = undefined
	try {
		const response = (await pb.send(`/api/invite/${token.value}`, {
			method: "GET",
		})) as PreviewResponse
		preview.value = response

		// preview is public; we handle auth on accept
	} catch {
		error.value = "Failed to load invite."
	} finally {
		loading.value = false
	}
}

async function acceptInvite() {
	if (accepting.value) return
	accepting.value = true
	error.value = undefined
	try {
		if (!isLoggedIn.value) {
			const next = encodeURIComponent(route.fullPath)
			return router.replace(`/auth/login?next=${next}`)
		}
		const response = (await pb.send(`/api/invite/${token.value}/accept`, {
			method: "POST",
		})) as {
			joined: boolean
			roomId: string
			alreadyMember?: boolean
		}
		if (response?.joined && response?.roomId) {
			return router.replace(`/room/${response.roomId}`)
		}
		error.value = "Could not join the room."
	} catch (error_: any) {
		error.value = error_?.data?.message || error_?.message || "Invite is not valid."
	} finally {
		accepting.value = false
	}
}

onMounted(loadPreview)
</script>

<template>
	<div class="mx-auto max-w-xl px-4 py-10">
		<h1 class="mb-4 text-2xl font-semibold">Room Invite</h1>

		<div v-if="loading">Loading invite…</div>

		<div v-else>
			<div v-if="error" class="mb-4 text-red-600">{{ error }}</div>

			<template v-if="preview?.valid">
				<p class="mb-2">
					You are invited to join
					<strong>{{ preview?.room?.name || "this room" }}</strong>
				</p>
				<p v-if="preview?.expiresAt" class="mb-4 text-sm text-gray-500">
					Expires at: {{ new Date(preview.expiresAt as any).toLocaleString() }}
				</p>

				<div class="flex gap-3">
					<UButton :disabled="accepting" @click="acceptInvite">
						{{ accepting ? "Joining…" : "Accept Invite" }}
					</UButton>
					<NuxtLink to="/dashboard" class="px-4 py-2">Back to dashboard</NuxtLink>
				</div>
			</template>

			<template v-else>
				<p class="mb-2">This invite link is not valid.</p>
				<p v-if="preview?.reason" class="mb-4 text-sm text-gray-500">
					Reason: {{ preview.reason }}
				</p>
				<NuxtLink to="/" class="text-purpleish-500">Go to home</NuxtLink>
			</template>
		</div>
	</div>
</template>

<style scoped></style>
