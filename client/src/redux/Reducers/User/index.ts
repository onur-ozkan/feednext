import { SIGN_IN, SIGN_OUT, UserActions } from '../../Actions/User/types'

let userReducerDefaultState: any = null

export const userReducer = (state = userReducerDefaultState, action: UserActions) => {
	switch (action.type) {
		case SIGN_IN:
		// TODO
		case SIGN_OUT:
			return (userReducerDefaultState = null)
	}
}
