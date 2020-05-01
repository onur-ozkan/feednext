export declare interface IAppTheme {
	'@primary-color': string
	'@link-color': string
	'@success-color': string
	'@warning-color': string
	'@error-color': string
	'@font-size-base': string
	'@heading-color': string
	'@text-color': string
	'@text-color-secondary': string
	'@disabled-color': string
	'@border-radius-base': string
	'@border-color-base': string
	'@box-shadow-base': string
}

export const appTheme: IAppTheme = {
	// primary color for all components
	'@primary-color': '#188fce',
	// link color
	'@link-color': '#1890ff',
	// success state color
	'@success-color': '#52c41a',
	// warning state color
	'@warning-color': '#faad14',
	// error state color
	'@error-color': '#d60d17',
	// major text font size
	'@font-size-base': '14px',
	// heading text color
	'@heading-color': 'rgba(0, 0, 0, 0.85)',
	// major text color
	'@text-color': 'rgba(0, 0, 0, 0.65)',
	// secondary text color
	'@text-color-secondary': 'rgba(0, 0, 0, .45)',
	// disable state color
	'@disabled-color': 'rgba(0, 0, 0, .25)',
	// major border radius
	'@border-radius-base': '2px',
	// major border color
	'@border-color-base': '#d9d9d9',
	// major shadow for layers
	'@box-shadow-base': '0 2px 8px rgba(0, 0, 0, 0.15)',
}

export const themePlugin = {
	theme: [
		{
			key: 'dark',
			fileName: 'dark.css',
			theme: 'dark',
		},
		{
			key: 'dust',
			fileName: 'dust.css',
			modifyVars: {
				'@primary-color': '#F5222D',
			},
		},
		{
			key: 'volcano',
			fileName: 'volcano.css',
			modifyVars: {
				'@primary-color': '#FA541C',
			},
		},
		{
			key: 'sunset',
			fileName: 'sunset.css',
			modifyVars: {
				'@primary-color': '#FAAD14',
			},
		},
		{
			key: 'cyan',
			fileName: 'cyan.css',
			modifyVars: {
				'@primary-color': '#13C2C2',
			},
		},
		{
			key: 'green',
			fileName: 'green.css',
			modifyVars: {
				'@primary-color': '#52C41A',
			},
		},
		{
			key: 'geekblue',
			fileName: 'geekblue.css',
			modifyVars: {
				'@primary-color': '#2F54EB',
			},
		},
		{
			key: 'purple',
			fileName: 'purple.css',
			modifyVars: {
				'@primary-color': '#722ED1',
			},
		},

		{
			key: 'dust',
			theme: 'dark',
			fileName: 'dark-dust.css',
			modifyVars: {
				'@primary-color': '#F5222D',
			},
		},
		{
			key: 'volcano',
			theme: 'dark',
			fileName: 'dark-volcano.css',
			modifyVars: {
				'@primary-color': '#FA541C',
			},
		},
		{
			key: 'sunset',
			theme: 'dark',
			fileName: 'dark-sunset.css',
			modifyVars: {
				'@primary-color': '#FAAD14',
			},
		},
		{
			key: 'cyan',
			theme: 'dark',
			fileName: 'dark-cyan.css',
			modifyVars: {
				'@primary-color': '#13C2C2',
			},
		},
		{
			key: 'green',
			theme: 'dark',
			fileName: 'dark-green.css',
			modifyVars: {
				'@primary-color': '#52C41A',
			},
		},
		{
			key: 'geekblue',
			theme: 'dark',
			fileName: 'dark-geekblue.css',
			modifyVars: {
				'@primary-color': '#2F54EB',
			},
		},
		{
			key: 'purple',
			theme: 'dark',
			fileName: 'dark-purple.css',
			modifyVars: {
				'@primary-color': '#722ED1',
			},
		},
	],
}
