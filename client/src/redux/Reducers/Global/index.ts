// Local files
import {
	SET_ACCESS_TOKEN,
	SET_UNREAD_MESSAGES_INFO,
	GlobalActions,
	INCREASE_UNREAD_MESSAGE_VALUE,
	DECREASE_UNREAD_MESSAGE_VALUE
} from '../../Actions/Global'

const globalReducerDefaultState: {
	accessToken: string | null,
	unreadMessageInfo: {
		values_by_conversations: { id: string, value: number }[],
		total_unread_value: number
	} | null
} = {
	accessToken: null,
	unreadMessageInfo: null,
}

export const globalReducer = (state = globalReducerDefaultState, action: GlobalActions): any => {
	switch (action.type) {
		case SET_ACCESS_TOKEN:
			return {
				...state,
				accessToken: action.token,
			}
		case SET_UNREAD_MESSAGES_INFO:
			return {
				...state,
				unreadMessageInfo: action.data
			}
		case INCREASE_UNREAD_MESSAGE_VALUE:
			return {
				...state,
				unreadMessageInfo: {
					...state.unreadMessageInfo,
					values_by_conversations: [...state.unreadMessageInfo?.values_by_conversations].map(item => {
						if (item.id === action.id) {
							return {
								...item,
								value: (item.value + action.value),
							}
						}
						else return item
					}),
					total_unread_value: (state.unreadMessageInfo?.total_unread_value + action.value)
				}
			}
		case DECREASE_UNREAD_MESSAGE_VALUE:
			return {
				...state,
				unreadMessageInfo: {
					...state.unreadMessageInfo,
					values_by_conversations: [...state.unreadMessageInfo?.values_by_conversations].map(item => {
						if (item.id === action.id) {
							return {
								...item,
								value: item.value > 0 ? (item.value - action.value) : 0,
							}
						}
						else return item
					}),
					total_unread_value: state.unreadMessageInfo?.total_unread_value > 0 ? (state.unreadMessageInfo?.total_unread_value - action.value) : 0
				}
			}
		default:
			return state
	}
}
