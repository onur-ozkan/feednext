import { parse, ParsedUrlQuery } from 'querystring'
import pathRegexp from 'path-to-regexp'
import { Route } from '@/models/connect'

const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/

export const isUrl = (path: string): boolean => reg.test(path)

export const isAntDesignPro = (): boolean => {
	if (ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
		return true
	}
	return window.location.hostname === 'preview.pro.ant.design'
}

// For the official demo site,
// used to turn off features that are not needed in the real development environment

export const isAntDesignProOrDev = (): boolean => {
	const { NODE_ENV } = process.env
	if (NODE_ENV === 'development') {
		return true
	}
	return isAntDesignPro()
}

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
