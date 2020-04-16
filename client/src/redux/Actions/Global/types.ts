export const SET_ACCESS_TOKEN = 'SET_ACCESS_TOKEN'
export const SET_CATEGORY_LIST = 'SET_CATEGORY_LIST'

export interface SetAccessTokenAction {
	type: typeof SET_ACCESS_TOKEN
	token: string
}

export interface SetCategoryListAction {
	type: typeof SET_CATEGORY_LIST
	list: []
}

export type GlobalActions = SetAccessTokenAction | SetCategoryListAction
