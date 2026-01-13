<script setup lang="ts">
import type { RoomsRecord } from "~/types/pb"
import { User } from "~/composables/database/use-user"

const emit = defineEmits<{
	(event: "updated", payload: { type: "removed" | "promoted"; userId: string }): void
}>()

const props = defineProps<{
	room: RoomsRecord
	userId: string
	userName?: string
}>()

const currentUser = new User()
const canManage = computed(() => currentUser.getRole(props.room) >= 1)
const isCreator = computed(() => props.userId === props.room.creator)
const isSelf = computed(() => props.userId === currentUser.id)
const isAlreadyAdmin = computed(() => (props.room.admins || []).includes(props.userId))

const removeUser = async () => {
	try {
		if (!canManage.value) return
		if (isCreator.value || isSelf.value) return

		const room = await pb.collection("rooms").getOne<RoomsRecord>(props.room.id)
		const nextUsers = (room.user || []).filter((id) => id !== props.userId)
		const nextAdmins = (room.admins || []).filter((id) => id !== props.userId)

		await pb.collection("rooms").update(props.room.id, {
			user: nextUsers,
			admins: nextAdmins,
		})

		useToast().add({ title: `Removed ${props.userName || "user"}`, color: "success" })
		emit("updated", { type: "removed", userId: props.userId })
	} catch (error) {
		toastError(`${error}`)
	}
}

const promoteToAdmin = async () => {
	try {
		if (!canManage.value) return
		if (isCreator.value || isAlreadyAdmin.value) return

		const room = await pb.collection("rooms").getOne<RoomsRecord>(props.room.id)
		const currentAdmins = room.admins || []
		if (!currentAdmins.includes(props.userId)) currentAdmins.push(props.userId)

		await pb.collection("rooms").update(props.room.id, {
			admins: currentAdmins,
			user: [...new Set([...(room.user || []), props.userId])],
		})

		useToast().add({
			title: `Promoted ${props.userName || "user"} to admin`,
			color: "success",
		})
		emit("updated", { type: "promoted", userId: props.userId })
	} catch (error) {
		toastError(`${error}`)
	}
}

const items = computed(() => [
	{
		label: "Promote to Admin",
		icon: "lucide:user-pen",
		onSelect: () => promoteToAdmin(),
	},
	{
		label: "Remove User",
		icon: "lucide:user-minus",
		color: "error" as const,
		onSelect: () => removeUser(),
	},
])

const showDropdown = computed(
	() => canManage.value && !isSelf.value && items.value.length > 0,
)
</script>

<template>
	<UDropdownMenu v-if="showDropdown" :items="items">
		<UButton block variant="ghost" icon="lucide:arrow-right" />
	</UDropdownMenu>
</template>
