<script setup lang="ts">
import type { RoomsRecord } from "~/types/pb"

const open = defineModel<boolean>("open")
const props = defineProps<{ room: RoomsRecord }>()

const generatingLink = ref(false)
const inviteLink = ref<string | null>()

// ----------------------------------------------------------------------------

const origin = computed(() =>
	import.meta.client && typeof location !== "undefined" ? location.origin : "",
)

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

				<!-- email-based invites removed -->
			</div>
		</template>
		<template #footer>
			<div class="w-full flex justify-end gap-2">
				<UButton variant="ghost" @click="open = false">Close</UButton>
			</div>
		</template>
	</UModal>
</template>
