export const SET_ACCESS_TOKEN = 'SET_ACCESS_TOKEN'
export const SET_UNREAD_MESSAGES_INFO = 'SET_UNREAD_MESSAGES_INFO'
export const ADD_ITEM_TO_MESSAGES_INFO = 'ADD_ITEM_TO_MESSAGES_INFO'
export const INCREASE_UNREAD_MESSAGE_VALUE = 'INCREASE_UNREAD_MESSAGE_VALUE'
export const DECREASE_UNREAD_MESSAGE_VALUE = 'DECREASE_UNREAD_MESSAGE_VALUE'

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

export interface AddItemToMessagesInfoAction {
	type: typeof ADD_ITEM_TO_MESSAGES_INFO
	item: { id: string, value: number }
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

export type GlobalActions =
	SetAccessTokenAction
	| SetUnreadMessagesInfoAction
	| AddItemToMessagesInfoAction
	| IncreaseUnreadMessageValueAction
	| DecreaseUnreadMessageValueAction
