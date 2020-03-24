import { AnyAction, Reducer } from 'redux'
import { EffectsCommandMap } from 'dva'
import { CurrentUser, GeographicItemType } from './data.d'
import { queryCity, queryCurrent, queryProvince, query as queryUsers } from './service'

export declare interface ModalState {
	currentUser?: Partial<CurrentUser>
	province?: GeographicItemType[]
	city?: GeographicItemType[]
	isLoading?: boolean
}

export type Effect = (
	action: AnyAction,
	effects: EffectsCommandMap & {
		select: <T>(func: (state: ModalState) => T) => T
	},
) => void

export declare interface ModelType {
	namespace: string
	state: ModalState
	effects: {
		fetchCurrent: Effect
		fetch: Effect
		fetchProvince: Effect
		fetchCity: Effect
	}
	reducers: {
		saveCurrentUser: Reducer<ModalState>
		changeNotifyCount: Reducer<ModalState>
		setProvince: Reducer<ModalState>
		setCity: Reducer<ModalState>
		changeLoading: Reducer<ModalState>
	}
}

const Model: ModelType = {
	namespace: 'accountAndSettings',

	state: {
		currentUser: {},
		province: [],
		city: [],
		isLoading: false,
	},

	effects: {
		*fetch(_, { call, put }): Generator {
			const response = yield call(queryUsers)
			yield put({
				type: 'save',
				payload: response,
			})
		},
		*fetchCurrent(_, { call, put }): Generator {
			const response = yield call(queryCurrent)
			yield put({
				type: 'saveCurrentUser',
				payload: response,
			})
		},
		*fetchProvince(_, { call, put }): Generator {
			yield put({
				type: 'changeLoading',
				payload: true,
			})
			const response = yield call(queryProvince)
			yield put({
				type: 'setProvince',
				payload: response,
			})
		},
		*fetchCity({ payload }, { call, put }): Generator {
			const response = yield call(queryCity, payload)
			yield put({
				type: 'setCity',
				payload: response,
			})
		},
	},

	reducers: {
		saveCurrentUser(
			state,
			action,
		): {
			currentUser: any
			province?: GeographicItemType[] | undefined
			city?: GeographicItemType[] | undefined
			isLoading?: boolean | undefined
		} {
			return {
				...state,
				currentUser: action.payload || {},
			}
		},
		changeNotifyCount(state = {}, action): any {
			return {
				...state,
				currentUser: {
					...state.currentUser,
					notifyCount: action.payload.totalCount,
					unreadCount: action.payload.unreadCount,
				},
			}
		},
		setProvince(
			state,
			action,
		): {
			province?: GeographicItemType[] | undefined
			city?: GeographicItemType[] | undefined
			isLoading?: boolean | undefined
		} {
			return {
				...state,
				province: action.payload,
			}
		},
		setCity(
			state,
			action,
		): {
			province?: GeographicItemType[] | undefined
			city?: GeographicItemType[] | undefined
			isLoading?: boolean | undefined
		} {
			return {
				...state,
				city: action.payload,
			}
		},
		changeLoading(
			state,
			action,
		): {
			province?: GeographicItemType[] | undefined
			city?: GeographicItemType[] | undefined
			isLoading?: boolean | undefined
		} {
			return {
				...state,
				isLoading: action.payload,
			}
		},
	},
}

export default Model
