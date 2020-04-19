import { Dispatch } from 'redux'
import { SET_ACCESS_TOKEN, SetAccessTokenAction, SET_CATEGORY_LIST, SetCategoryListAction } from './types'

export const StartGlobalActions = {
	setAccessToken: (token: string) => {
		return (dispatch: Dispatch<SetAccessTokenAction>): void => {
			dispatch({
				type: SET_ACCESS_TOKEN,
				token,
			})
		}
	},
	setCategoryList: (list: []) => {
		return (dispatch: Dispatch<SetCategoryListAction>): void => {
			dispatch({
				type: SET_CATEGORY_LIST,
				list,
			})
		}
	}
}
