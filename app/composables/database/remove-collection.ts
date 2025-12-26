import type { RoomsResponse } from "~/types/pb"

export const removeCollection = async (collection: RoomsResponse) => {
	await pb.send(`/api/room/leave/${collection.id}`, {
		method: "GET",
	})
}
