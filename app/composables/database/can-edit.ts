import type { AuthRecord } from "pocketbase"
import type { DecksResponse } from "~/types/pb"

export const canEdit = (deck: DecksResponse) => {
	const user: AuthRecord = pb.authStore.record
	if (!user) throw new Error("No user logged in")

	if (user.id === deck.creator || deck.admins.includes(user.id)) {
		return true
	} else {
		return false
	}
}
