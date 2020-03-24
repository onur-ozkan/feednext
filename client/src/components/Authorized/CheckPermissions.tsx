import React from 'react'
import { CURRENT } from './renderAuthorize'
import PromiseRender from './PromiseRender'

export type IAuthorityType =
	| undefined
	| string
	| string[]
	| Promise<boolean>
	| ((currentAuthority: string | string[]) => IAuthorityType)

/**
 * Common check permissions method
 * @param { any | Permission judgment } authority
 * @param { any | Your permission description } currentAuthority
 * @param { any | Passing components } target
 * @param { any | no pass components } Exception
 */
const checkPermissions = <T, K>(
	authority: IAuthorityType,
	currentAuthority: string | string[],
	target: T,
	Exception: K,
): T | K | React.ReactNode => {
	// Retirement authority, return target;
	if (!authority) {
		return target
	}

	if (Array.isArray(authority)) {
		if (Array.isArray(currentAuthority)) {
			if (currentAuthority.some(item => authority.includes(item))) {
				return target
			}
		} else if (authority.includes(currentAuthority)) {
			return target
		}
		return Exception
	}

	if (typeof authority === 'string') {
		if (Array.isArray(currentAuthority)) {
			if (currentAuthority.some(item => authority === item)) {
				return target
			}
		} else if (authority === currentAuthority) {
			return target
		}
		return Exception
	}

	if (authority instanceof Promise) {
		return <PromiseRender<T, K> ok={target} error={Exception} promise={authority} />
	}

	if (typeof authority === 'function') {
		try {
			const bool = authority(currentAuthority)

			if (bool instanceof Promise) {
				return <PromiseRender<T, K> ok={target} error={Exception} promise={bool} />
			}
			if (bool) {
				return target
			}
			return Exception
		} catch (error) {
			throw error
		}
	}
	throw new Error('unsupported parameters')
}

export { checkPermissions }

function check<T, K>(authority: IAuthorityType, target: T, Exception: K): T | K | React.ReactNode {
	return checkPermissions<T, K>(authority, CURRENT, target, Exception)
}

export default check
