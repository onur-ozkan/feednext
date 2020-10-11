// Antd dependencies
import { Button, Result, notification  } from 'antd'
import { MessageOutlined } from '@ant-design/icons'

// Other dependencies
import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useRouter } from 'next/router'

// Local files
import { SET_ACCESS_TOKEN, SET_UNREAD_MESSAGES_INFO, INCREASE_UNREAD_MESSAGE_VALUE, ADD_ITEM_TO_MESSAGES_INFO } from '@/redux/Actions/Global'
import { checkAccessToken, refreshToken, fetchUnreadMessageInfo } from '@/services/api'
import { handleSessionExpiration } from '@/services/utils.service'
import { socketConnection } from '@/services/socket.service'
import { Roles } from '@/enums'

export const RouteHandler: React.FC<{ authority: number, children: any }> = (props) => {
	const router = useRouter()

	const [lastMessageFromSocket, setLastMessageFromSocket] = useState<{ conversation_id: string, from: string, body: string } | null>(null)
	const globalState = useSelector((state: any) => state.global)
	const user = useSelector((state: any) => state.user)
	const wss = socketConnection(globalState.accessToken)
	const dispatch = useDispatch()

	const checkIsSessionValid = async (): Promise<void> => {
		await checkAccessToken(globalState.accessToken)
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
		await fetchUnreadMessageInfo(globalState.accessToken).then(({ data }) => {
			dispatch({
				type: SET_UNREAD_MESSAGES_INFO,
				data: data.attributes
			})
		})
	}

	const handleInitialProcessesOnRoute = async (): Promise<void> => {
		if (globalState.accessToken) {
			await checkIsSessionValid()
			await handleUnreadMessages()
		}
	}

	useEffect(() => {
		handleInitialProcessesOnRoute()
		// Handle message notifications
		if (globalState.accessToken) {
			wss.on('pingMessage', (incMessage: { conversation_id: string, from: string, body: string }) => {
				if (router.route !== '/messages') {
					notification.info({
						closeIcon: null,
						message: incMessage.from,
						description: incMessage.body,
						duration: 2,
						icon: <MessageOutlined style={{ color: '#188fce' }}/>,
					})

					setLastMessageFromSocket(incMessage)
				}
			})

			return () => {
				wss.disconnect()
			}
		}
	}, [])

	// Handle notifications on messages
	useEffect(() => {
		if (lastMessageFromSocket) {
			const conversation = globalState.unreadMessageInfo?.values_by_conversations.find(item => item.id === lastMessageFromSocket.conversation_id)
			if (!conversation) {
				dispatch({
					type: ADD_ITEM_TO_MESSAGES_INFO,
					item: {
						id: lastMessageFromSocket.conversation_id,
						value: 1
					}
				})
			} else {
				dispatch({
					type: INCREASE_UNREAD_MESSAGE_VALUE,
					id: lastMessageFromSocket.conversation_id,
					value: 1
				})
			}
			setLastMessageFromSocket(null)
		}
	}, [lastMessageFromSocket])

	if (process.browser && !user && props.authority >= Roles.User && router.route !== '/') {
		router.push('/auth/sign-in')
		return null
	}

	else if (user && props.authority > user.attributes.user.role) {
		return (
			<Result
				status="403"
				title="403"
				subTitle="Sorry, your account role doesnt have access to this page"
				extra={
					<Button type="primary" onClick={() => router.push('/')}>
						Back Home
					</Button>
				}
			/>
		)
	}

	return props.children
}
