export const SIGN_IN = 'SIGN_IN'
export const SIGN_OUT = 'SIGN_OUT'
export const UPDATE_USER = 'UPDATE_USER'
export const VOTE_ENTRY = 'VOTE_ENTRY'
export const UNDO_ENTRY_VOTE = 'UNDO_ENTRY_VOTE'

export interface UserPayload {
    type: string
    id: string
    attributes: {
        email: string
        username: string
        "full_name": string
        role: number
        "is_active": boolean
        "up_voted_entries": []
        "down_voted_entries": []
        "created_at": string
    }
}

export interface UpdateUserPayload {
	fullName?: string
	link?: string
	biography?: string
}

export interface SignInAction {
	type: typeof SIGN_IN
	user: UserPayload
}

export interface SignOutAction {
	type: typeof SIGN_OUT
}

export interface UpdateUserAction {
	type: typeof UPDATE_USER
	payload: UpdateUserPayload
}

export interface VoteEntryAction {
	type: typeof VOTE_ENTRY
	entryId: string
	voteTo: 'up' | 'down'
}

export interface UndoEntryVoteAction {
	type: typeof UNDO_ENTRY_VOTE
	from: 'up' | 'down'
	entryId: string
}

export type UserActions = SignInAction | SignOutAction | VoteEntryAction | UndoEntryVoteAction | UpdateUserAction
