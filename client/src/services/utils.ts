import { parse, ParsedUrlQuery } from 'querystring'
import pathRegexp from 'path-to-regexp'
import { Route } from '@/models/connect'
import { persistor } from '@/redux/store'
import { checkAccessToken } from './api'

const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/

export const isUrl = (path: string): boolean => reg.test(path)

export const getPageQuery = (): ParsedUrlQuery => parse(window.location.href.split('?')[1])

/**
 * props.route.routes
 * @param router [{}]
 * @param pathname string
 */
export const getAuthorityFromRouter = <T extends Route>(router: T[] = [], pathname: string): T | undefined => {
	const authority = router.find(
		({ routes, path = '/' }) =>
			(path && pathRegexp(path).exec(pathname)) || (routes && getAuthorityFromRouter(routes, pathname)),
	)
	if (authority) return authority
	return undefined
}

export const getRouteAuthority = (path: string, routeData: Route[]): string | string[] | undefined => {
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

export const checkIsUserExpired = (token: string): void => {
	checkAccessToken(`Bearer ${token}`).catch(async (_e: any) => {
		await persistor.purge()
		window.location.reload()
	})
}
