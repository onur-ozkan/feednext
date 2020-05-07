export const SIGN_IN = 'SIGN_IN'
export const UPDATE_USER = 'UPDATE_USER'

export interface UserPayload {
    type: string
    id: string
    attributes: {
        email: string
        username: string
        "full_name": string
        role: number
        "is_active": boolean
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

export interface UpdateUserAction {
	type: typeof UPDATE_USER
	payload: UpdateUserPayload
}

export type UserActions = SignInAction | UpdateUserAction
