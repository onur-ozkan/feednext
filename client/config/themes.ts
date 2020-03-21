export const appTheme = {
	'@primary-color': '#ff2d20',
	// primary color for all components
	'@link-color': '#1890ff',
	// link color
	'@success-color': '#52c41a',
	// success state color
	'@warning-color': '#faad14',
	// warning state color
	'@error-color': '#d60d17',
	// error state color
	'@font-size-base': '14px',
	// major text font size
	'@heading-color': 'rgba(0, 0, 0, 0.85)',
	// heading text color
	'@text-color': 'rgba(0, 0, 0, 0.65)',
	// major text color
	'@text-color-secondary': 'rgba(0, 0, 0, .45)',
	// secondary text color
	'@disabled-color': 'rgba(0, 0, 0, .25)',
	// disable state color
	'@border-radius-base': '2px',
	// major border radius
	'@border-color-base': '#d9d9d9',
	// major border color
	'@box-shadow-base': '0 2px 8px rgba(0, 0, 0, 0.15)', // major shadow for layers
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
