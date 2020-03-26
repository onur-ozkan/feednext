import { Dispatch } from 'redux'
import { SIGN_IN, SIGN_OUT, SignInPayload, UserActions } from './types'

export const signIn = (payload: SignInPayload): UserActions => ({
	type: SIGN_IN,
	payload,
})

export const signOut = (): UserActions => ({
	type: SIGN_OUT,
})

export const startSignIn = (payload: SignInPayload) => {
	return (dispatch: Dispatch<UserActions>): void => {
		dispatch(signIn(payload))
	}
}

export const startSignOut = () => {
	return (dispatch: Dispatch<UserActions>): void => {
		dispatch(signOut())
	}
}
