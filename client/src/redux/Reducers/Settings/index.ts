import { NAV_LAYOUT, NAV_THEME, SettingsActions } from '../../Actions/Settings/types'
import defaultSettings from '@/../config/defaultSettings'

const userReducerDefaultState: any = defaultSettings

export const settingsReducer = (state = userReducerDefaultState, action: SettingsActions): any => {
	switch (action.type) {
		case NAV_THEME:
			return (defaultSettings.navTheme = action.payload.navTheme)
		case NAV_LAYOUT:
			return (defaultSettings.layout = action.payload.layout)
		default:
			return state
	}
}
