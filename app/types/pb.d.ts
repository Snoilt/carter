/**
* This file was @generated using pocketbase-typegen
*/

import type PocketBase from 'pocketbase'
import type { RecordService } from 'pocketbase'

export enum Collections {
	Authorigins = "_authOrigins",
	Externalauths = "_externalAuths",
	Mfas = "_mfas",
	Otps = "_otps",
	Superusers = "_superusers",
	Cards = "cards",
	Decks = "decks",
	FsrsParameterSets = "fsrs_parameter_sets",
	Rooms = "rooms",
	RoomsUserInfo = "rooms_user_info",
	UserCardFsrsState = "user_card_fsrs_state",
	UserCards = "user_cards",
	UserReviews = "user_reviews",
	Users = "users",
}

// Alias types for improved usability
export type IsoDateString = string
export type IsoAutoDateString = string & { readonly autodate: unique symbol }
export type RecordIdString = string
export type FileNameString = string & { readonly filename: unique symbol }
export type HTMLString = string

type ExpandType<T> = unknown extends T
	? T extends unknown
		? { expand?: unknown }
		: { expand: T }
	: { expand: T }

// System fields
export type BaseSystemFields<T = unknown> = {
	id: RecordIdString
	collectionId: string
	collectionName: Collections
} & ExpandType<T>

export type AuthSystemFields<T = unknown> = {
	email: string
	emailVisibility: boolean
	username: string
	verified: boolean
} & BaseSystemFields<T>

// Record types for each collection

export type AuthoriginsRecord = {
	collectionRef: string
	created: IsoAutoDateString
	fingerprint: string
	id: string
	recordRef: string
	updated: IsoAutoDateString
}

export type ExternalauthsRecord = {
	collectionRef: string
	created: IsoAutoDateString
	id: string
	provider: string
	providerId: string
	recordRef: string
	updated: IsoAutoDateString
}

export type MfasRecord = {
	collectionRef: string
	created: IsoAutoDateString
	id: string
	method: string
	recordRef: string
	updated: IsoAutoDateString
}

export type OtpsRecord = {
	collectionRef: string
	created: IsoAutoDateString
	id: string
	password: string
	recordRef: string
	sentTo?: string
	updated: IsoAutoDateString
}

export type SuperusersRecord = {
	created: IsoAutoDateString
	email: string
	emailVisibility?: boolean
	id: string
	password: string
	tokenKey: string
	updated: IsoAutoDateString
	verified?: boolean
}

export type CardsRecord = {
	created: IsoAutoDateString
	deck?: RecordIdString
	id: string
	question?: HTMLString
	solution?: HTMLString
	updated: IsoAutoDateString
}

export type DecksRecord<TplayData = unknown> = {
	created: IsoAutoDateString
	creator?: RecordIdString
	description?: string
	id: string
	name?: string
	playData?: null | TplayData
	roomId: RecordIdString
	updated: IsoAutoDateString
}

export type FsrsParameterSetsRecord<Tweigths_json = unknown> = {
	created: IsoAutoDateString
	deck_id?: RecordIdString
	desired_retention?: number
	id: string
	updated: IsoAutoDateString
	user_id?: RecordIdString
	weigths_json?: null | Tweigths_json
}

export type RoomsRecord = {
	admins?: RecordIdString[]
	created: IsoAutoDateString
	creator: RecordIdString
	description?: string
	id: string
	name: string
	updated: IsoAutoDateString
	user?: RecordIdString[]
}

export type RoomsUserInfoRecord = {
	id: string
	rooms?: RecordIdString
	userAvatar?: FileNameString
	userId?: RecordIdString
	userName: string
}

export enum UserCardFsrsStateStateOptions {
	"new" = "new",
	"learning" = "learning",
	"review" = "review",
	"relearning" = "relearning",
}
export type UserCardFsrsStateRecord = {
	created: IsoAutoDateString
	difficulty?: number
	id: string
	lapses?: number
	last_reviewed_at?: IsoDateString
	stability?: number
	state?: UserCardFsrsStateStateOptions
	updated: IsoAutoDateString
	user_card_id?: RecordIdString
}

export type UserCardsRecord = {
	card_id?: RecordIdString
	created: IsoAutoDateString
	deck_id?: RecordIdString
	due_at?: IsoDateString
	id: string
	suspended?: boolean
	updated: IsoAutoDateString
	user_id?: RecordIdString
}

export type UserReviewsRecord = {
	id: string
	new_difficulty?: number
	new_due_at?: IsoDateString
	new_stability?: number
	previous_difficulty?: number
	previous_due_at?: IsoDateString
	previous_stability?: number
	rating?: number
	reviewed_at: IsoAutoDateString
	user_card_id?: RecordIdString
}

export type UsersRecord = {
	avatar?: FileNameString
	created: IsoAutoDateString
	email: string
	emailVisibility?: boolean
	id: string
	name: string
	password: string
	tokenKey: string
	updated: IsoAutoDateString
	verified?: boolean
}

// Response types include system fields and match responses from the PocketBase API
export type AuthoriginsResponse<Texpand = unknown> = Required<AuthoriginsRecord> & BaseSystemFields<Texpand>
export type ExternalauthsResponse<Texpand = unknown> = Required<ExternalauthsRecord> & BaseSystemFields<Texpand>
export type MfasResponse<Texpand = unknown> = Required<MfasRecord> & BaseSystemFields<Texpand>
export type OtpsResponse<Texpand = unknown> = Required<OtpsRecord> & BaseSystemFields<Texpand>
export type SuperusersResponse<Texpand = unknown> = Required<SuperusersRecord> & AuthSystemFields<Texpand>
export type CardsResponse<Texpand = unknown> = Required<CardsRecord> & BaseSystemFields<Texpand>
export type DecksResponse<TplayData = unknown, Texpand = unknown> = Required<DecksRecord<TplayData>> & BaseSystemFields<Texpand>
export type FsrsParameterSetsResponse<Tweigths_json = unknown, Texpand = unknown> = Required<FsrsParameterSetsRecord<Tweigths_json>> & BaseSystemFields<Texpand>
export type RoomsResponse<Texpand = unknown> = Required<RoomsRecord> & BaseSystemFields<Texpand>
export type RoomsUserInfoResponse<Texpand = unknown> = Required<RoomsUserInfoRecord> & BaseSystemFields<Texpand>
export type UserCardFsrsStateResponse<Texpand = unknown> = Required<UserCardFsrsStateRecord> & BaseSystemFields<Texpand>
export type UserCardsResponse<Texpand = unknown> = Required<UserCardsRecord> & BaseSystemFields<Texpand>
export type UserReviewsResponse<Texpand = unknown> = Required<UserReviewsRecord> & BaseSystemFields<Texpand>
export type UsersResponse<Texpand = unknown> = Required<UsersRecord> & AuthSystemFields<Texpand>

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
	_authOrigins: AuthoriginsRecord
	_externalAuths: ExternalauthsRecord
	_mfas: MfasRecord
	_otps: OtpsRecord
	_superusers: SuperusersRecord
	cards: CardsRecord
	decks: DecksRecord
	fsrs_parameter_sets: FsrsParameterSetsRecord
	rooms: RoomsRecord
	rooms_user_info: RoomsUserInfoRecord
	user_card_fsrs_state: UserCardFsrsStateRecord
	user_cards: UserCardsRecord
	user_reviews: UserReviewsRecord
	users: UsersRecord
}

export type CollectionResponses = {
	_authOrigins: AuthoriginsResponse
	_externalAuths: ExternalauthsResponse
	_mfas: MfasResponse
	_otps: OtpsResponse
	_superusers: SuperusersResponse
	cards: CardsResponse
	decks: DecksResponse
	fsrs_parameter_sets: FsrsParameterSetsResponse
	rooms: RoomsResponse
	rooms_user_info: RoomsUserInfoResponse
	user_card_fsrs_state: UserCardFsrsStateResponse
	user_cards: UserCardsResponse
	user_reviews: UserReviewsResponse
	users: UsersResponse
}

// Utility types for create/update operations

type ProcessCreateAndUpdateFields<T> = Omit<{
	// Omit AutoDate fields
	[K in keyof T as Extract<T[K], IsoAutoDateString> extends never ? K : never]: 
		// Convert FileNameString to File
		T[K] extends infer U ? 
			U extends (FileNameString | FileNameString[]) ? 
				U extends any[] ? File[] : File 
			: U
		: never
}, 'id'>

// Create type for Auth collections
export type CreateAuth<T> = {
	id?: RecordIdString
	email: string
	emailVisibility?: boolean
	password: string
	passwordConfirm: string
	verified?: boolean
} & ProcessCreateAndUpdateFields<T>

// Create type for Base collections
export type CreateBase<T> = {
	id?: RecordIdString
} & ProcessCreateAndUpdateFields<T>

// Update type for Auth collections
export type UpdateAuth<T> = Partial<
	Omit<ProcessCreateAndUpdateFields<T>, keyof AuthSystemFields>
> & {
	email?: string
	emailVisibility?: boolean
	oldPassword?: string
	password?: string
	passwordConfirm?: string
	verified?: boolean
}

// Update type for Base collections
export type UpdateBase<T> = Partial<
	Omit<ProcessCreateAndUpdateFields<T>, keyof BaseSystemFields>
>

// Get the correct create type for any collection
export type Create<T extends keyof CollectionResponses> =
	CollectionResponses[T] extends AuthSystemFields
		? CreateAuth<CollectionRecords[T]>
		: CreateBase<CollectionRecords[T]>

// Get the correct update type for any collection
export type Update<T extends keyof CollectionResponses> =
	CollectionResponses[T] extends AuthSystemFields
		? UpdateAuth<CollectionRecords[T]>
		: UpdateBase<CollectionRecords[T]>

// Type for usage with type asserted PocketBase instance
// https://github.com/pocketbase/js-sdk#specify-typescript-definitions

export type TypedPocketBase = {
	collection<T extends keyof CollectionResponses>(
		idOrName: T
	): RecordService<CollectionResponses[T]>
} & PocketBase
