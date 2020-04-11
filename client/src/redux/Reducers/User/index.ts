/* eslint-disable @typescript-eslint/camelcase */
import { SIGN_IN, SIGN_OUT, UserActions, VOTE_ENTRY, UNDO_ENTRY_VOTE } from '../../Actions/User/types'

const userReducerDefaultState: any = null

export const userReducer = (state = userReducerDefaultState, action: UserActions): any => {
	switch (action.type) {
		case SIGN_IN:
			return (state = action.user)
		case SIGN_OUT:
			return (state = null)
		case VOTE_ENTRY:
			return {
				...state,
				attributes: {
					...state.attributes,
					user: {
						...state.attributes.user,
						// eslint-disable-next-line @typescript-eslint/camelcase
						...(action.voteTo === 'up' ? {up_voted_entries: [...state.attributes.user.up_voted_entries, action.entryId]}
							:
							{down_voted_entries: [...state.attributes.user.down_voted_entries, action.entryId]}
						),
					}
				}
			}
		case UNDO_ENTRY_VOTE:
			return {
				...state,
				attributes: {
					...state.attributes,
					user: {
						...state.attributes.user,
						...(action.from === 'up' ? {up_voted_entries: state.attributes.user.up_voted_entries.filter((item: string) => action.entryId !== item)}
							:
							{down_voted_entries: state.attributes.user.down_voted_entries.filter((item: string) => action.entryId !== item)}
						),
					}
				}
			}
		default:
			return state
	}
}
