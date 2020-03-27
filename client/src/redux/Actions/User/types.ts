export const SIGN_IN = 'SIGN_IN'
export const SIGN_OUT = 'SIGN_OUT'

export interface SignInPayload {
	userInformation: any
}

export interface SignInAction {
	type: typeof SIGN_IN
	payload: SignInPayload
}

export interface SignOutAction {
	type: typeof SIGN_OUT
}

export type UserActions = SignInAction | SignOutAction
