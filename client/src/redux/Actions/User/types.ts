export const SIGN_IN = 'SIGN_IN'
export const SIGN_OUT = 'SIGN_OUT'

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

export interface SignInAction {
	type: typeof SIGN_IN
	user: UserPayload
}

export interface SignOutAction {
	type: typeof SIGN_OUT
}

export type UserActions = SignInAction | SignOutAction
