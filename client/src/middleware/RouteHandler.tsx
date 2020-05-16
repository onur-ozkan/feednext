// Antd dependencies
import { Button, Result, notification  } from 'antd'
import { MessageOutlined } from '@ant-design/icons'

// Other dependencies
import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Redirect, history } from 'umi'
import { stringify } from 'querystring'

// Local files
import { SET_ACCESS_TOKEN, SET_UNREAD_MESSAGES_INFO, INCREASE_UNREAD_MESSAGE_VALUE } from '@/redux/Actions/Global'
import { checkAccessToken, refreshToken, fetchUnreadMessageInfo } from '@/services/api'
import { getAuthorityFromRouter, handleSessionExpiration } from '@/services/utils'
import { socketConnection } from '@/services/socket'
import { User } from '@/../config/constants'
import PageLoading from '@/components/PageLoading'

const RouteHandler = ({ children, route }) => {
	const [isLoading, setIsLoading] = useState(true)
	const user = useSelector((state: any) => state.user)
	const accessToken = useSelector((state: any) => state.global.accessToken)
	const wss = socketConnection(accessToken)
	const dispatch = useDispatch()

	const checkIsSessionValid = async (): Promise<void> => {
		await checkAccessToken(accessToken)
			.catch(_error => {
				refreshToken().then(res => {
					dispatch({
						type: SET_ACCESS_TOKEN,
						token: res.data.attributes.access_token
					})
				}).catch(_e => handleSessionExpiration())
			})
	}

	const handleUnreadMessages = async (): Promise<void> => {
		await fetchUnreadMessageInfo(accessToken).then(({ data }) => {
			dispatch({
				type: SET_UNREAD_MESSAGES_INFO,
				data: data.attributes
			})
		})
	}

	const handleInitialProcessesOnRoute = async (): Promise<void> => {
		if (accessToken) {
			await checkIsSessionValid()
			await handleUnreadMessages()
		}

		setIsLoading(false)
	}

	useEffect((): void => {
		handleInitialProcessesOnRoute()
		// Handle message notifications
		if (accessToken) {
			wss.on('pingMessage', (incMessage: { conversation_id: string, from: string, body: string }) => {
				if (location.pathname !== '/messages') {
					notification.info({
						closeIcon: null,
						message: incMessage.from,
						description: incMessage.body,
						duration: 2,
						icon: <MessageOutlined style={{ color: '#188fce' }}/>,
					})
					dispatch({
						type: INCREASE_UNREAD_MESSAGE_VALUE,
						id: incMessage.conversation_id,
						value: 1
					})
				}
			})

			return (): void => {
				wss.disconnect()
			}
		}
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
					<Button type="primary" onClick={(): void => history.push('/')}>
						Back Home
					</Button>
				}
			/>
		)
	}

	return children
}

export default RouteHandler
