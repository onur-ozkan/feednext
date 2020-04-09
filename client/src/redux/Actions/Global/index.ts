import { Dispatch } from 'redux'
import { SET_ACCESS_TOKEN, SetAccessTokenAction } from './types'

export const StartGlobalActions = {
	setAccessToken: (token: string) => {
		return (dispatch: Dispatch<SetAccessTokenAction>): void => {
			dispatch({
				type: SET_ACCESS_TOKEN,
				token,
			})
		}
	}
}
