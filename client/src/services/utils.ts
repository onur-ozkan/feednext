import { parse, ParsedUrlQuery } from 'querystring'
import pathRegexp from 'path-to-regexp'
import { Route } from '@/models/connect'
import { persistor } from '@/redux/store'
import { message } from 'antd'
import { router } from 'umi'

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

export const handleSessionExpiration = async (): Promise<void> => {
	await persistor.purge()
	router.push('/auth/sign-in')
	message.info('User session has been expired, please Sign in again.', 4)
}

export const forgeTreeSelectData = (rawList: any[]): any[] => {
	const dataset: any[] = []
	rawList.map(item => {
		const {
			name: title,
			parent_category: parent_category,
			id: value
		} = {...item}

		dataset.push(Object.assign({}, {title, value, ...parent_category && { parent_category } }))
	})

	const hashTable = Object.create(null)
	dataset.forEach((item: { value: string | number }) => (hashTable[item.value] = { ...item, children: [] }))

	const dataTree: any[] = []
	dataset.forEach((item: { parent_category: string | number; value: string | number }) => {
		if (item.parent_category) hashTable[item['parent_category']].children.push(hashTable[item.value])
		else dataTree.push(hashTable[item.value])
	})

	return dataTree
}

export const handleArrayFiltering = (list: any[], filterKey: any) => {
	return list.find(item => item.id === filterKey)
}
