// Antd dependencies
import { MenuTheme } from 'antd/es/menu/MenuContext'

// Local files
import { IAppTheme, appTheme } from './themes'

export type ContentWidth = 'Fluid' | 'Fixed'

export declare interface DefaultSettings {
	navTheme: MenuTheme
	primaryColor: string
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

export default {
	navTheme: 'dark',
	layout: 'topmenu',
	contentWidth: 'Fluid',
	fixedHeader: true,
	autoHideHeader: false,
	fixSiderbar: false,
	colorWeak: false,
	menu: {
		locale: true,
	},
	title: null,
	pwa: false,
	iconfontUrl: '',
	...appTheme,
} as DefaultSettings & IAppTheme
