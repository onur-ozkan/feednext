import React, { useState, useEffect } from 'react'
import { PageLoading } from '@ant-design/pro-layout'
import { Redirect, router } from 'umi'
import { stringify } from 'querystring'
import { getAuthorityFromRouter, handleSessionExpiration } from '@/services/utils'
import { User } from '@/../config/constants'
import { Result, Button } from 'antd'
import { useSelector, useDispatch } from 'react-redux'
import { SET_ACCESS_TOKEN, SET_CATEGORY_LIST } from '@/redux/Actions/Global/types'
import { checkAccessToken, refreshToken, fetchAllCategories } from '@/services/api'

const RouteHandler = ({ children, route }) => {
	const [isLoading, setIsLoading] = useState(true)
	const user = useSelector((state: any) => state.user)
	const accessToken = useSelector((state: any) => state.global.accessToken)
	const dispatch = useDispatch()

	const checkSessionSituation = async (): Promise<void> => {
		await checkAccessToken(accessToken).catch(_error => {
			refreshToken().then(res => {
				dispatch({
					type: SET_ACCESS_TOKEN,
					token: res.data.attributes.access_token
				})
			}).catch(_e => handleSessionExpiration())
		})
	}

	const handleInitialProcessesOnRoute = async (): Promise<void> => {
		if (accessToken) await checkSessionSituation()
		await fetchAllCategories().then(res => {
			dispatch({
				type: SET_CATEGORY_LIST,
				list: res.data.attributes.categories
			})
		})
		setIsLoading(false)
	}

	useEffect(() => {
		handleInitialProcessesOnRoute()
	}, [])

	const queryString = stringify({
		redirect: window.location.href,
	})

	const authorized: any = getAuthorityFromRouter(route?.routes, location.pathname || '/')

	if (isLoading) {
		return <PageLoading />
	}

	if (!user && authorized && authorized.authority >= User && window.location.pathname !== '/auth/sign-in') {
		return <Redirect to={`/auth/sign-in?${queryString}`} />
	}

	if (user && authorized && authorized.authority > user.attributes.user.role) {
		return (
			<Result
				status="403"
				title="403"
				subTitle="Sorry, your account role doesnt have access to this page"
				extra={
					<Button type="primary" onClick={(): void => router.push('/')}>
						Back Home
					</Button>
				}
			/>
		)
	}

	return children
}

export default RouteHandler
