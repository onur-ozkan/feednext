import { AnyAction, Reducer } from 'redux'

import { EffectsCommandMap } from 'dva'
import { ListItemDataType } from './data'
import { queryFakeList } from './service'

export interface StateType {
	list: ListItemDataType[]
}

export type Effect = (
	action: AnyAction,
	effects: EffectsCommandMap & {
		select: <T>(func: (state: StateType) => T) => T
	},
) => void

export interface ModelType {
	namespace: string
	state: StateType
	effects: {
		fetch: Effect
		appendFetch: Effect
	}
	reducers: {
		queryList: Reducer<StateType>
		appendList: Reducer<StateType>
	}
}

const Model: ModelType = {
	namespace: 'feeds',

	state: {
		list: [],
	},

	effects: {
		*fetch({ payload }, { call, put }): Generator {
			const response = yield call(queryFakeList, payload)
			yield put({
				type: 'queryList',
				payload: Array.isArray(response) ? response : [],
			})
		},
		*appendFetch({ payload }, { call, put }): Generator {
			const response = yield call(queryFakeList, payload)
			yield put({
				type: 'appendList',
				payload: Array.isArray(response) ? response : [],
			})
		},
	},

	reducers: {
		queryList(state, action): any {
			return {
				...state,
				list: action.payload,
			}
		},
		appendList(state, action): { list: ListItemDataType[] } {
			return {
				...state,
				list: (state as StateType).list.concat(action.payload),
			}
		},
	},
}

export default Model
