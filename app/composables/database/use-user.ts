import type { AuthRecord } from "pocketbase"
import type { DeckcollectionsResponse } from "~/types/pb"

class User {
	id: string
	email: string
	constructor(id: string, email: string) {
		this.id = id
		this.email = email
	}

	getRole(collection: DeckcollectionsResponse): 0 | 1 | 2 {
		if (this.id == collection.creator) return 2
		else if (collection.admins && collection.admins.includes(this.id)) return 1
		else return 0
	}

	getCollections(): Promise<DeckcollectionsResponse[]> {
		return pb.collection("deckcollections").getFullList<DeckcollectionsResponse>()
	}

	logOut() {
		pb.authStore.clear()
	}
}

export const useUser = (): User => {
	const user: AuthRecord = pb.authStore.record
	if (!user) throw new Error("No user logged in")

	return new User(user.id, user.email)
}
