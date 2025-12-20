<script setup lang="ts">
import type { DeckcollectionsRecord } from "~/types/pb"

const props = defineProps<{
	collection: DeckcollectionsRecord
}>()

const deckUsers = await pb.collection("viewDeckUser").getFullList({
	filter: `deckcollection = "${props.collection.id}"`,
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
