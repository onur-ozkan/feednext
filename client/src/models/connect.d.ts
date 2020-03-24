import { AnyAction } from 'redux'
import { MenuDataItem } from '@ant-design/pro-layout'
import { RouterTypes } from 'umi'
import { GlobalModelState } from './global'
import { DefaultSettings as SettingModelState } from '../../config/defaultSettings'
import { UserModelState } from './user'
import { StateType } from './login'

export { GlobalModelState, SettingModelState, UserModelState }

export declare interface Loading {
	global: boolean
	effects: {
		[key: string]: boolean | undefined
	}
	models: {
		global?: boolean
		menu?: boolean
		setting?: boolean
		user?: boolean
		login?: boolean
	}
}

export declare interface ConnectState {
	global: GlobalModelState
	loading: Loading
	settings: SettingModelState
	user: UserModelState
	login: StateType
}

export declare interface Route extends MenuDataItem {
	routes?: Route[]
}

/**
 * @type T: Params matched in dynamic routing
 */
export declare interface ConnectProps<T = {}> extends Partial<RouterTypes<Route, T>> {
	dispatch?: Dispatch<AnyAction>
}
