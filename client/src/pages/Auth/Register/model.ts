import { AnyAction, Reducer } from 'redux'

import { EffectsCommandMap } from 'dva'
import { fakeRegister } from './service'

export declare interface StateType {
	status?: 'ok' | 'error'
	currentAuthority?: 'user' | 'guest' | 'admin'
}

export type Effect = (
	action: AnyAction,
	effects: EffectsCommandMap & {
		select: <T>(func: (state: StateType) => T) => T
	},
) => void

export declare interface ModelType {
	namespace: string
	state: StateType
	effects: {
		submit: Effect
	}
	reducers: {
		registerHandle: Reducer<StateType>
	}
}

const Model: ModelType = {
	namespace: 'userAndregister',

	state: {
		status: undefined,
	},

	effects: {
		*submit({ payload }, { call, put }): Generator<string, any, undefined> {
			const response = yield call(fakeRegister, payload)
			yield put({
				type: 'registerHandle',
				payload: response,
			})
		},
	},

	reducers: {
		registerHandle(state, { payload }): { status: any } {
			return {
				...state,
				status: payload.status,
			}
		},
	},
}

export default Model
