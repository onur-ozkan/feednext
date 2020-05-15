// Antd dependencies
import { Avatar, Row, Col, List, Pagination, Badge } from 'antd'

// Other dependencies
import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { router } from 'umi'

// Local files
import { INCREASE_UNREAD_MESSAGE_VALUE, SET_UNREAD_MESSAGES_INFO } from '@/redux/Actions/Global'
import { fetchUsersConversations, fetchMessagesByConversationId } from '@/services/api'
import { API_URL } from '@/../config/constants'
import PageLoading from '@/components/PageLoading'
import newMessagePng from '@/assets/newMessage.png'
import styles from '../../index.less'

export const ConversationList = (params): JSX.Element => {
	const userState = useSelector((state: any) => state.user.attributes.user)
	const [paginationValue, setPaginationValue] = useState(0)
	const [isLoading, setIsLoading] = useState(true)
	const [lastMessageFromSocket, setLastMessageFromSocket] = useState<{
		conversation_id: string,
		from: string,
		body: string
	} | null>(null)

	const dispatch = useDispatch()

	// Listen incoming messages and save it to the state
	useEffect(() => {
		params.wss.on('pingMessage', (incMessage: {
			conversation_id: string,
			from: string,
			body: string
		}) => setLastMessageFromSocket(incMessage))

		return (): void => {
			params.wss.close()
		}
	}, [])

	// Fetch current user's conversations and save them to the state
	useEffect(() => {
		fetchUsersConversations(params.globalState.accessToken, paginationValue)
			.then(({ data }) => {
				params.setCurrentConversations(data.attributes)
				if (isLoading) setIsLoading(false)
			})
	}, [paginationValue])

	// Pop a notification on conversation bar when message comes via socket
	useEffect(() => {
		if (lastMessageFromSocket) {
			if (params.activeConversationId !== lastMessageFromSocket.conversation_id) {
				dispatch({
					type: INCREASE_UNREAD_MESSAGE_VALUE,
					id: lastMessageFromSocket.conversation_id,
					value: 1
				})
			}
			else {
				fetchMessagesByConversationId(params.globalState.accessToken, lastMessageFromSocket.conversation_id, 0)
				setLastMessageFromSocket(null)
			}
		}
	}, [lastMessageFromSocket])

	useEffect(() => {
		if (lastMessageFromSocket && paginationValue === 0 &&
			!params.currentConversations?.conversations.find(item => item._id === lastMessageFromSocket.conversation_id)?._id) {
			params.setCurrentConversations({
				...params.currentConversations,
				conversations: [
					...params.currentConversations.conversations,
					{
						_id: lastMessageFromSocket.conversation_id,
						participants: [params.username, lastMessageFromSocket.from]
					}
				]
			})
			// It gets the unread values from dispatch of INCREASE_UNREAD_MESSAGE_VALUE already
			// Following dispatch is only for saving new conversation to the state
			dispatch({
				type: SET_UNREAD_MESSAGES_INFO,
				data: {
					values_by_conversations: [
						...params.globalState.unreadMessageInfo.values_by_conversations,
						{
							id: lastMessageFromSocket.conversation_id,
							value: 0
						}
					],
					total_unread_value: params.globalState.unreadMessageInfo.total_unread_value
				}
			})
		}
	}, [lastMessageFromSocket])

	if (isLoading) return <PageLoading />

	const handleConversationListView = (): JSX.Element => {
		const listView = params.currentConversations.conversations.map((conversation) => {
			const recipientUsername = (conversation.participants[0] === userState.username) ?
				conversation.participants[1] : conversation.participants[0]
			const unreadValue = params.globalState.unreadMessageInfo?.values_by_conversations.find((item: any) => item.id == conversation._id)?.value
			return (
				<Col
					key={conversation._id}
					onClick={(): void => {
						params.setActiveConversation(conversation)
						params.setRecipientUsername(recipientUsername)
					}}
					className={styles['person']}
					span={24}
				>
					<List.Item.Meta
						style={{ justifyContent: 'center', alignContent: 'center' }}
						avatar={
							<Badge count={unreadValue || 0}>
								<Avatar
									shape="circle"
									size="large"
									src={`${API_URL}/v1/user/pp?username=${recipientUsername}`}
								/>
							</Badge>
						}
					/>
				</Col>
			)
		})

		return listView
	}

	return (
		<div className={styles['left']}>
			<div style={{ textAlign: 'center' }} className={styles['top']}>
				<Avatar
					onClick={(): void => router.push('/messages/compose')}
					style={{ cursor: 'pointer' }}
					shape="square" size="large" src={newMessagePng}
				/>
			</div>
			<Row className={styles['people']}>
				{handleConversationListView()}
				<Pagination
					style={{
						position: 'absolute',
						left: 0,
						bottom: 10,
						fontSize: 15,
						padding: '0px 0px 0px 10px',
						zIndex: 1
					}}
					onChange={(page: number): void => {
						params.setActiveConversation(null)
						params.setRecipientUsername(null)
						setPaginationValue(10 * (page - 1))
					}}
					simple
					hideOnSinglePage
					defaultCurrent={1}
					total={params.currentConversations.count}
				/>
			</Row>
		</div>
	)
}
