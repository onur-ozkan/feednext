import { SIGN_IN, SIGN_OUT, UserActions } from '../../Actions/User/types'

const userReducerDefaultState: any = null

export const userReducer = (state = userReducerDefaultState, action: UserActions): any => {
	switch (action.type) {
		case SIGN_IN:
			return (state = action.user)
		case SIGN_OUT:
			return (state = null)
		default:
			return state
	}
}
