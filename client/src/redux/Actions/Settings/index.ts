import { Dispatch } from 'redux'
import { NAV_THEME, HandleNavThemePayload, SettingsActions, HandleNavLayoutPayload, NAV_LAYOUT } from './types'

export const StartSettingsActions = {
	handleNavTheme: (payload: HandleNavThemePayload) => {
		return (dispatch: Dispatch<SettingsActions>): void => {
			dispatch({
				type: NAV_THEME,
				payload,
			})
		}
	},
	handleNavLayout: (payload: HandleNavLayoutPayload) => {
		return (dispatch: Dispatch<SettingsActions>): void => {
			dispatch({
				type: NAV_LAYOUT,
				payload,
			})
		}
	},
}
