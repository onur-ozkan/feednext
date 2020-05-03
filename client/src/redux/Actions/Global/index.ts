export const SET_ACCESS_TOKEN = 'SET_ACCESS_TOKEN'
export const SET_CATEGORY_LIST = 'SET_CATEGORY_LIST'
export const SET_CATEGORY_TREE = 'SET_CATEGORY_TREE'

export interface SetAccessTokenAction {
	type: typeof SET_ACCESS_TOKEN
	token: string
}

export interface SetCategoryListAction {
	type: typeof SET_CATEGORY_LIST
	list: []
}

export interface SetCategoryTreeAction {
	type: typeof SET_CATEGORY_TREE
	data: []
}

export type GlobalActions = SetAccessTokenAction | SetCategoryListAction | SetCategoryTreeAction
