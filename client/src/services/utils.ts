// Antd dependencies
import { message } from 'antd'

// Other dependencies
import { parse, ParsedUrlQuery } from 'querystring'
import pathRegexp from 'path-to-regexp'

// Local files
import { persistor } from '@/redux/store'

const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/

export const isUrl = (path: string): boolean => reg.test(path)

export const getPageQuery = (): ParsedUrlQuery => parse(window.location.href.split('?')[1])

export const getRouteAuthority = (path: string, routeData): string | string[] | undefined => {
	let authorities: string[] | string | undefined
	routeData.forEach(route => {
		// match prefix
		if (pathRegexp(`${route.path}/(.*)`).test(`${path}/`)) {
			if (route.authority) {
				authorities = route.authority
			}
			// exact match
			if (route.path === path) {
				authorities = route.authority || authorities
			}
			// get children authority recursively
			if (route.routes) {
				authorities = getRouteAuthority(path, route.routes) || authorities
			}
		}
	})
	return authorities
}

export const handleSessionExpiration = async (): Promise<void> => {
	await persistor.purge()
	location.href = '/auth/sign-in'
	message.info('User session has been expired, please Sign in again')
}
