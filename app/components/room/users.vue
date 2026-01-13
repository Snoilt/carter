<script setup lang="ts">
import type { FileNameString, RoomsRecord, RoomsUserInfoRecord } from "~/types/pb"

const props = defineProps<{
	collection: RoomsRecord
}>()

const deckUsers = ref<RoomsUserInfoRecord[]>([])

const fetchUsers = async () => {
	deckUsers.value = await pb
		.collection("rooms_user_info")
		.getFullList<RoomsUserInfoRecord>({ filter: `rooms = "${props.collection.id}"` })
}

onMounted(fetchUsers)

const onMenuUpdate = (payload: { type: "removed" | "promoted"; userId: string }) => {
	if (payload.type === "removed") {
		deckUsers.value = deckUsers.value.filter((u) => u.userId !== payload.userId)
	}
}
</script>

<template>
	<UPageList>
		<UCard v-for="(user, index) in deckUsers" :key="index" variant="subtle" class="mt-5">
			<template #default>
				<div class="grid grid-cols-[minmax(0,1fr)_auto] items-center w-full gap-2">
					<UUser
						:avatar="{ src: pb.files.getURL(user, user.userAvatar as FileNameString) }"
						:name="user.userName"
						size="xl"
						class="relative"
					/>
					<RoomManagerDropdown
						class="justify-self-end"
						:room="props.collection"
						:user-id="user.userId!"
						:user-name="user.userName"
						@updated="onMenuUpdate"
					/>
				</div>
			</template>
		</UCard>
	</UPageList>
</template>
