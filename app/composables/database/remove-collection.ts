import type { DeckcollectionsResponse } from "~/types/pb"

export const removeCollection = async (collection: DeckcollectionsResponse) => {
	await pb.send(`/api/room/leave/${collection.id}`, {
		method: "GET",
	})
}
