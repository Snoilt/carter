import type { RoomsRecord } from "~/types/pb"
export const removeCollection = async (collection: RoomsRecord) => {
	await pb.send(`/api/room/leave/${collection.id}`, {
		method: "GET",
	})
}
