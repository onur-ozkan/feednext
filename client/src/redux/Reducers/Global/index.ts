// Local files
import {
	SET_ACCESS_TOKEN,
	SET_CATEGORY_LIST,
	SET_CATEGORY_TREE,
	SET_UNREAD_MESSAGES_INFO,
	GlobalActions,
	INCREASE_UNREAD_MESSAGE_VALUE,
	DECREASE_UNREAD_MESSAGE_VALUE,
} from '../../Actions/Global'

const globalReducerDefaultState: {
	accessToken: string | null,
	unreadMessageInfo: {
		values_by_conversations: { id: string, value: number }[],
		total_unread_value: number
	} | null,
	categoryList: [] | null,
	categoryTree: [] | null
} = {
	accessToken: null,
	unreadMessageInfo: null,
	categoryList: null,
	categoryTree: null
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
								// eslint-disable-next-line @typescript-eslint/camelcase
								value: (item.value + action.value),
							}
						}
						else return item
					}),
					// eslint-disable-next-line @typescript-eslint/camelcase
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
								// eslint-disable-next-line @typescript-eslint/camelcase
								value: item.value > 0 ? (item.value - action.value) : 0,
							}
						}
						else return item
					}),
					// eslint-disable-next-line @typescript-eslint/camelcase
					total_unread_value: state.unreadMessageInfo?.total_unread_value > 0 ? (state.unreadMessageInfo?.total_unread_value - action.value) : 0
				}
			}
		case SET_CATEGORY_LIST:
			return {
				...state,
				categoryList: action.list
			}
		case SET_CATEGORY_TREE:
			return {
				...state,
				categoryTree: action.data
			}
		default:
			return state
	}
}
