import { AnyAction, Reducer } from 'redux'
import { EffectsCommandMap } from 'dva'
import { ActivitiesType, CurrentUser, NoticeType, RadarDataType } from './data.d'
import { fakeChartData, queryActivities, queryCurrent, queryProjectNotice } from './service'

export declare interface ModalState {
	currentUser?: CurrentUser
	projectNotice: NoticeType[]
	activities: ActivitiesType[]
	radarData: RadarDataType[]
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
	reducers: {
		save: Reducer<ModalState>
		clear: Reducer<ModalState>
	}
	effects: {
		init: Effect
		fetchUserCurrent: Effect
		fetchProjectNotice: Effect
		fetchActivitiesList: Effect
		fetchChart: Effect
	}
}

const Model: ModelType = {
	namespace: 'account',
	state: {
		currentUser: undefined,
		projectNotice: [],
		activities: [],
		radarData: [],
	},
	effects: {
		*init(_, { put }): Generator {
			yield put({
				type: 'fetchUserCurrent',
			})
			yield put({
				type: 'fetchProjectNotice',
			})
			yield put({
				type: 'fetchActivitiesList',
			})
			yield put({
				type: 'fetchChart',
			})
		},
		*fetchUserCurrent(_, { call, put }): Generator {
			const response = yield call(queryCurrent)
			yield put({
				type: 'save',
				payload: {
					currentUser: response,
				},
			})
		},
		*fetchProjectNotice(_, { call, put }): Generator {
			const response = yield call(queryProjectNotice)
			yield put({
				type: 'save',
				payload: {
					projectNotice: Array.isArray(response) ? response : [],
				},
			})
		},
		*fetchActivitiesList(_, { call, put }): Generator {
			const response = yield call(queryActivities)
			yield put({
				type: 'save',
				payload: {
					activities: Array.isArray(response) ? response : [],
				},
			})
		},
		*fetchChart(_, { call, put }): Generator | unknown {
			const { radarData } = yield call(fakeChartData)
			yield put({
				type: 'save',
				payload: {
					radarData,
				},
			})
		},
	},
	reducers: {
		save(state, { payload }): any {
			return {
				...state,
				...payload,
			}
		},
		clear(): {
			currentUser: undefined
			projectNotice: never[]
			activities: never[]
			radarData: never[]
		} {
			return {
				currentUser: undefined,
				projectNotice: [],
				activities: [],
				radarData: [],
			}
		},
	},
}

export default Model
