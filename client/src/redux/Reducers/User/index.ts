// Local files
import { SIGN_IN, UserActions, UPDATE_USER } from '../../Actions/User'

const userReducerDefaultState: any = null

export const userReducer = (state = userReducerDefaultState, action: UserActions): any => {
	switch (action.type) {
		case SIGN_IN:
			return (state = action.user)
		case UPDATE_USER:
			return {
				...state,
				attributes: {
					...state.attributes,
					user: {
						...state.attributes.user,
						...action.payload.fullName && { full_name: action.payload.fullName },
						...action.payload.link && { link: action.payload.link },
						...action.payload.biography && { biography: action.payload.biography },
					}
				}
			}
		default:
			return state
	}
}
