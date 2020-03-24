import React from 'react'
import CheckPermissions from './CheckPermissions'

/*
 * default is "NULL"
 */
const Exception403 = (): number => 403

export const isComponentClass = (component: React.ComponentClass | React.ReactNode): boolean => {
	if (!component) return false
	const proto = Object.getPrototypeOf(component)
	if (proto === React.Component || proto === Function.prototype) return true
	return isComponentClass(proto)
}

// Determine whether the incoming component has been instantiated
// AuthorizedRoute is already instantiated
// Authorized  render is already instantiated, children is no instantiated
// Secured is not instantiated
const checkIsInstantiation = (target: React.ComponentClass | React.ReactNode): any => {
	if (isComponentClass(target)) {
		const Target = target as React.ComponentClass
		// eslint-disable-next-line react/display-name
		return (props: any): any => <Target {...props} />
	}
	if (React.isValidElement(target)) {
		return (props: any): any => React.cloneElement(target, props)
	}
	return (): string | number | boolean | {} | React.ReactNodeArray | React.ComponentClass<{}, any> | null | undefined =>
		target
}

const authorize = (authority: string, error?: React.ReactNode): any => {
	/**
	 * conversion into a class
	 * String parameters can cause staticContext not found error
	 */
	let classError: boolean | React.FunctionComponent = false
	if (error) {
		classError = (() => error) as React.FunctionComponent
	}
	if (!authority) {
		throw new Error('authority is required')
	}
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	return function decideAuthority(target: React.ComponentClass | React.ReactNode): any {
		const component = CheckPermissions(authority, target, classError || Exception403)
		return checkIsInstantiation(component)
	}
}

export default authorize
