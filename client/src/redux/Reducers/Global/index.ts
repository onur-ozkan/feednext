import { SET_ACCESS_TOKEN, GlobalActions, SET_CATEGORY_LIST } from '../../Actions/Global/types'

const globalReducerDefaultState: {
	accessToken: string | null,
	categoryList: [] | null
} = {
	accessToken: null,
	categoryList: null
}

export const globalReducer = (state = globalReducerDefaultState, action: GlobalActions): any => {
	switch (action.type) {
		case SET_ACCESS_TOKEN:
			return (state = Object.assign({}, state, {
				accessToken: action.token
			}))
		case SET_CATEGORY_LIST:
			return (state = Object.assign({}, state, {
				categoryList: action.list
			}))
		default:
			return state
	}
}
