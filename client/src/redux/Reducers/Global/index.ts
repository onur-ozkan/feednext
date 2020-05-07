import { SET_ACCESS_TOKEN, GlobalActions, SET_CATEGORY_LIST, SET_CATEGORY_TREE } from '../../Actions/Global'
import { SOCKET_URL } from '@/../config/constants'
import io from 'socket.io-client'

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
				socketConnection: io(SOCKET_URL, {
					query: {
						Athorization: `Bearer ${action.token}`
					}
				})
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
