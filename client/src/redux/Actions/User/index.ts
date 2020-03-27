import { Dispatch } from 'redux'
import { SIGN_IN, SIGN_OUT, SignInPayload, UserActions } from './types'

export const StartUserActions = {
	SignIn: (payload: SignInPayload) => {
		return (dispatch: Dispatch<UserActions>): void => {
			dispatch({
				type: SIGN_IN,
				payload,
			})
		}
	},

	SignOut: () => {
		return (dispatch: Dispatch<UserActions>): void => {
			dispatch({
				type: SIGN_OUT,
			})
		}
	},
}
