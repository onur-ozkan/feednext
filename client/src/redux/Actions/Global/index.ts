export const SET_ACCESS_TOKEN = 'SET_ACCESS_TOKEN'
export const SET_WS_SOCKET = 'SET_WS_SOCKET'
export const SET_CATEGORY_LIST = 'SET_CATEGORY_LIST'
export const SET_CATEGORY_TREE = 'SET_CATEGORY_TREE'

export interface SetAccessTokenAction {
	type: typeof SET_ACCESS_TOKEN
	token: string
}

export interface SetWsSocketnAction {
	type: typeof SET_WS_SOCKET
	socket: SocketIOClient.Socket
}

export interface SetCategoryListAction {
	type: typeof SET_CATEGORY_LIST
	list: []
}

export interface SetCategoryTreeAction {
	type: typeof SET_CATEGORY_TREE
	data: []
}

export type GlobalActions = SetAccessTokenAction | SetWsSocketnAction | SetCategoryListAction | SetCategoryTreeAction
