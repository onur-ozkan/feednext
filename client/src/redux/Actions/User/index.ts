export const SIGN_IN = 'SIGN_IN'
export const UPDATE_USER = 'UPDATE_USER'

export interface UserPayload {
    type: string
    id: string
    attributes: {
        full_name: string,
		username: string,
		email: string,
		biography: string,
		link: string,
		role: number,
		is_active: boolean,
		is_verified: boolean
		created_at: string,
		updated_at: string
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
