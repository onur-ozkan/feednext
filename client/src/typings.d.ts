declare module 'slash2'
declare module '*.css'
declare module '*.less'
declare module '*.scss'
declare module '*.sass'
declare module '*.svg'
declare module '*.png'
declare module '*.jpg'
declare module '*.jpeg'
declare module '*.gif'
declare module '*.bmp'
declare module '*.tiff'
declare module 'omit.js'

// google analytics declare interface
declare interface GAFieldsObject {
	eventCategory: string
	eventAction: string
	eventLabel?: string
	eventValue?: number
	nonInteraction?: boolean
}
declare interface Window {
	ga: (command: 'send', hitType: 'event' | 'pageview', fieldsObject: GAFieldsObject | string) => void
	reloadAuthorized: () => void
}

declare let ga: Function

// preview.pro.ant.design only do not use in your production
declare let ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION: 'site' | undefined

declare const REACT_APP_ENV: 'test' | 'dev' | 'pre' | false
