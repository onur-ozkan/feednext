export const SET_ACCESS_TOKEN = 'SET_ACCESS_TOKEN'
export const SET_UNREAD_MESSAGES_INFO = 'SET_UNREAD_MESSAGES_INFO'
export const INCREASE_UNREAD_MESSAGE_VALUE = 'INCREASE_UNREAD_MESSAGE_VALUE'
export const DECREASE_UNREAD_MESSAGE_VALUE = 'DECREASE_UNREAD_MESSAGE_VALUE'
export const SET_CATEGORY_LIST = 'SET_CATEGORY_LIST'
export const SET_CATEGORY_TREE = 'SET_CATEGORY_TREE'

export interface SetAccessTokenAction {
	type: typeof SET_ACCESS_TOKEN
	token: string
}

export interface SetUnreadMessagesInfoAction {
	type: typeof SET_UNREAD_MESSAGES_INFO
	data: {
		values_by_conversations: { id: string, value: number }[],
		total_unread_value: number
	}
}

export interface IncreaseUnreadMessageValueAction {
	type: typeof INCREASE_UNREAD_MESSAGE_VALUE,
	id: string,
	value: number
}

export interface DecreaseUnreadMessageValueAction {
	type: typeof DECREASE_UNREAD_MESSAGE_VALUE,
	id: string,
	value: number
}

export interface SetCategoryListAction {
	type: typeof SET_CATEGORY_LIST
	list: []
}

export interface SetCategoryTreeAction {
	type: typeof SET_CATEGORY_TREE
	data: []
}

export type GlobalActions =
	SetAccessTokenAction
	| SetUnreadMessagesInfoAction
	| IncreaseUnreadMessageValueAction
	| DecreaseUnreadMessageValueAction
	| SetCategoryListAction
	| SetCategoryTreeAction
