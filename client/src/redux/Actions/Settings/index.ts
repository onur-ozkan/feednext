export const NAV_THEME = 'HANDLE_NAV_THEME'
export const NAV_LAYOUT = 'HANDLE_NAV_LAYOUT'

export interface HandleNavThemePayload {
	navTheme: 'light' | 'dark'
}

export interface HandleNavLayoutPayload {
	layout: 'topmenu' | 'sidemenu'
}

export interface HandleNavThemeAction {
	type: typeof NAV_THEME
	payload: HandleNavThemePayload
}

export interface HandleNavLayoutAction {
	type: typeof NAV_LAYOUT
	payload: HandleNavLayoutPayload
}

export type SettingsActions = HandleNavLayoutAction | HandleNavThemeAction
