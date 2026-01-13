<script setup lang="ts">
import type { RoomsRecord } from "~/types/pb"

const open = defineModel<boolean>("open")
const props = defineProps<{ room: RoomsRecord }>()

// const emailList = ref<string[]>([])
// const creatingEmails = ref(false)
// const createdInvites = ref<{ email: string; url: string }[]>([])
const generatingLink = ref(false)
const inviteLink = ref<string | null>()

// ----------------------------------------------------------------------------

const origin = computed(() =>
	import.meta.client && typeof location !== "undefined" ? location.origin : "",
)

// ----------------------------------------------------------------------------

// async function createEmailInvites() {
// 	if (emailList.value.length === 0) return
// 	creatingEmails.value = true
// 	try {
// 		const response = await pb.send(`/api/room/${props.room.id}/invites/by-email`, {
// 			method: "POST",
// 			body: { emails: emailList.value },
// 		})
// 		const invites = (response?.invites || []) as { email: string; url: string }[]
// 		createdInvites.value = invites
// 		useToast().add({
// 			title: `Created ${invites.length} invite link(s)`,
// 			color: "success",
// 		})
// 	} catch {
// 		useToast().add({ title: "Failed to create invites", color: "error" })
// 	} finally {
// 		creatingEmails.value = false
// 	}
// }

// ----------------------------------------------------------------------------

async function generateLink() {
	generatingLink.value = true
	try {
		const response = await pb.send(`/api/room/${props.room.id}/invite`, {
			method: "POST",
		})
		inviteLink.value = response?.url as string
		if (inviteLink.value) {
			useToast().add({ title: "Invite link created", color: "success" })
		}
	} catch {
		useToast().add({ title: "Failed to create link", color: "error" })
	} finally {
		generatingLink.value = false
	}
}

// ----------------------------------------------------------------------------

async function copyToClipboard(text?: string | null) {
	if (!text) return
	try {
		await navigator.clipboard.writeText(origin.value + text)
		useToast().add({ title: "Copied to clipboard", color: "success" })
	} catch {
		useToast().add({ title: "Copy failed", color: "error" })
	}
}
</script>

<template>
	<UModal v-model:open="open" title="Invite to Room">
		<template #body>
			<div class="space-y-6">
				<div>
					<h3 class="mb-2 font-medium">Shareable Link</h3>
					<div class="flex gap-2 items-center">
						<UButton color="primary" :loading="generatingLink" @click="generateLink">
							{{ inviteLink ? "Regenerate Link" : "Generate Link" }}
						</UButton>
						<UButton
							v-if="inviteLink"
							variant="ghost"
							@click="copyToClipboard(inviteLink)"
						>
							Copy Link
						</UButton>
					</div>
					<p v-if="inviteLink" class="mt-2 truncate text-sm text-gray-500">
						{{ origin + inviteLink }}
					</p>
				</div>

				<!-- <div>
					<h3 class="mb-2 font-medium">Invite by Email</h3>
					<UForm>
						<UFormField name="emails" label="Emails">
							<UInputTags v-model="emailList" placeholder="Type email and press Enter" />
						</UFormField>
					</UForm>
					<div class="mt-2 flex gap-2">
						<UButton
							color="primary"
							:loading="creatingEmails"
							:disabled="emailList.length === 0"
							@click="createEmailInvites"
						>
							Create Invites
						</UButton>
						<UButton variant="ghost" @click="emailList = []">Clear</UButton>
					</div>

					<div v-if="createdInvites.length > 0" class="mt-4 space-y-2">
						<h4 class="text-sm font-medium">Created links</h4>
						<div
							v-for="it in createdInvites"
							:key="it.email"
							class="flex items-center gap-2"
						>
							<span class="w-36 truncate text-sm" :title="it.email">{{ it.email }}</span>
							<UButton size="xs" @click="copyToClipboard(it.url)">Copy</UButton>
						</div>
					</div>
				</div> -->
			</div>
		</template>
		<template #footer>
			<div class="w-full flex justify-end gap-2">
				<UButton variant="ghost" @click="open = false">Close</UButton>
			</div>
		</template>
	</UModal>
</template>
