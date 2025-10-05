import type { AuthRecord } from "pocketbase"
import type { DeckcollectionsResponse } from "~/types/pb"

export class User {
	id: string
	email: string
	constructor() {
		const user: AuthRecord = pb.authStore.record
		if (!user) throw toastError("Cant access User record")
		this.id = user.id
		this.email = user.email
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
