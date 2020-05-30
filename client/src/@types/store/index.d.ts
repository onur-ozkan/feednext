import { IAppTheme } from '@/../config/themes'

export interface GlobalState {
	accessToken: string,
	unreadMessageInfo: {
		values_by_conversations: {
			id: string,
			value: number
		}[],
		total_unread_value: 0
	}
}

export interface SettingsState {
	navTheme: MenuTheme
	theme: IAppTheme,
	layout: 'sidemenu' | 'topmenu'
	contentWidth: ContentWidth
	fixedHeader: boolean
	autoHideHeader: boolean
	fixSiderbar: boolean
	menu: {
		locale: boolean
	}
	title: string | null
	pwa: boolean
	iconfontUrl: string
	colorWeak: boolean
}

export interface UserState {
	type: 'user_information',
	id: string,
	attributes: {
		user: {
			biography: string,
			created_at: string,
			email: string,
			full_name: string,
			is_active: boolean,
			link: string,
			role: number,
			updated_at: string,
			username: string
		}
	}
}
