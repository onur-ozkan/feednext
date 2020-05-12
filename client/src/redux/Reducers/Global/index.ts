// Local files
import {
	SET_ACCESS_TOKEN,
	SET_CATEGORY_LIST,
	SET_CATEGORY_TREE,
	SET_WS_SOCKET,
	GlobalActions,
} from '../../Actions/Global'

const globalReducerDefaultState: {
	accessToken: string | null,
	socketConnection: SocketIOClient.Socket | null,
	categoryList: [] | null,
	categoryTree: [] | null
} = {
	accessToken: null,
	socketConnection: null,
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
		case SET_WS_SOCKET:
			return {
				...state,
				socketConnection: action.socket
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
