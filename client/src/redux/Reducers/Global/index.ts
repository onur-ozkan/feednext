import { SET_ACCESS_TOKEN, GlobalActions } from '../../Actions/Global/types'

const globalReducerDefaultState: { accessToken: string | null } = {
	accessToken: null,
}

export const globalReducer = (state = globalReducerDefaultState, action: GlobalActions): any => {
	switch (action.type) {
		case SET_ACCESS_TOKEN:
			return (state = Object.assign({}, state, {
				accessToken: action.token
			}))
		default:
			return state
	}
}
