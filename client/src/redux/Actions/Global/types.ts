export const SET_ACCESS_TOKEN = 'SET_ACCESS_TOKEN'

export interface SetAccessTokenAction {
	type: typeof SET_ACCESS_TOKEN
	token: string
}

export type GlobalActions = SetAccessTokenAction
