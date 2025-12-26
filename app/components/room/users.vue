<script setup lang="ts">
import type { RoomsRecord } from "~/types/pb"

const props = defineProps<{
	collection: RoomsRecord
}>()

const deckUsers = await pb.collection("rooms_user_info").getFullList({
	filter: `rooms = "${props.collection.id}"`,
})
</script>

<template>
	<UPageList>
		<UPageCard
			v-for="(user, index) in deckUsers"
			:key="index"
			variant="ghost"
			:to="user.to"
			:target="user.target"
		>
			<template #body>
				<UUser
					:avatar="{ src: pb.files.getURL(user, user.userAvatar) }"
					:name="user.userName"
					size="xl"
					class="relative"
					description="last played yesterday"
				/>
			</template>
		</UPageCard>
	</UPageList>
</template>
