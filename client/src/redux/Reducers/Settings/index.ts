import { NAV_LAYOUT, NAV_THEME, SettingsActions } from '../../Actions/Settings'
import defaultSettings from '@/../config/defaultSettings'

const settingsReducerDefaultState: any = defaultSettings

export const settingsReducer = (state = settingsReducerDefaultState, action: SettingsActions): any => {
	switch (action.type) {
		case NAV_THEME:
			return (state.navTheme = action.payload.navTheme)
		case NAV_LAYOUT:
			return (state.layout = action.payload.layout)
		default:
			return state
	}
}
