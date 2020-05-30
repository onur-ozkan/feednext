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
