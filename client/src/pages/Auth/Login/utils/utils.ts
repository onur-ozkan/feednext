import { parse } from 'qs'

export function getPageQuery(): any {
	return parse(window.location.href.split('?')[1])
}
