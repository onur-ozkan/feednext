import React, { useState, useEffect } from 'react'
import { PageLoading } from '@ant-design/pro-layout'
import { Redirect, router } from 'umi'
import { stringify } from 'querystring'
import { getAuthorityFromRouter, handleSessionExpiration } from '@/services/utils'
import { User } from '@/../config/constants'
import { Result, Button } from 'antd'
import { useSelector, useDispatch } from 'react-redux'
import { SET_ACCESS_TOKEN } from '@/redux/Actions/Global/types'
import { checkAccessToken, refreshToken } from '@/services/api'

const RouteHandler = ({ children, loading, route }) => {
	const [isReady, setIsReady] = useState(false)
	const user = useSelector((state: any) => state.user)
	const accessToken = useSelector((state: any) => state.global.accessToken)
	const dispatch = useDispatch()

	const checkSessionSituation = async (): Promise<void> => {
		await checkAccessToken(`Bearer ${accessToken}`).catch(err => {
			refreshToken().then(res => {
				dispatch({
					type: SET_ACCESS_TOKEN,
					token: res.data.attributes.access_token
				})
			}).catch(e => {
				handleSessionExpiration()
			})
		})
		setIsReady(true)
	}

	useEffect(() => {
		if (accessToken) checkSessionSituation()
		else setIsReady(true)
	}, [])

	const queryString = stringify({
		redirect: window.location.href,
	})

	const authorized: any = getAuthorityFromRouter(route?.routes, location.pathname || '/')

	if (loading || !isReady) {
		return <PageLoading />
	}

	if (!user && authorized.authority >= User && window.location.pathname !== '/auth/sign-in') {
		return <Redirect to={`/auth/sign-in?${queryString}`} />
	}

	if (user &&  authorized.authority > user.attributes.user.role) {
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
