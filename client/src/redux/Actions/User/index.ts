import { Dispatch } from 'redux'
import {
	SIGN_IN,
	SIGN_OUT,
	UserPayload,
	SignInAction,
	SignOutAction,
	UpdateUserAction,
	UPDATE_USER,
	UpdateUserPayload
} from './types'

export const StartUserActions = {
	signIn: (userPayload: UserPayload) => {
		return (dispatch: Dispatch<SignInAction>): void => {
			dispatch({
				type: SIGN_IN,
				user: userPayload
			})
		}
	},
	signOut: () => {
		return (dispatch: Dispatch<SignOutAction>): void => {
			dispatch({
				type: SIGN_OUT,
			})
		}
	},
	updateUser: (payload: UpdateUserPayload) => {
		return (dispatch: Dispatch<UpdateUserAction>): void => {
			dispatch({
				type: UPDATE_USER,
				payload
			})
		}
	}
}
