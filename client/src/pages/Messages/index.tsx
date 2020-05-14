/* eslint-disable @typescript-eslint/camelcase */
// Antd dependencies
import { Tabs, Card, Avatar, Button, Typography, Pagination, Badge } from 'antd'

// Other dependencies
import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { router } from 'umi'

// Local files
import { fetchUsersConversations, deleteConversation, fetchMessagesByConversationId } from '@/services/api'
import { API_URL } from '@/../config/constants'
import { ConversationResponseType } from './types'
import { DECREASE_UNREAD_MESSAGE_VALUE, INCREASE_UNREAD_MESSAGE_VALUE, SET_UNREAD_MESSAGES_INFO } from '@/redux/Actions/Global'
import { socketConnection } from '@/services/socket'
import PageLoading from '@/components/PageLoading'
import ChatScreen from './components/ChatScreen'
import conversationImg from '../../assets/conversation.png'
import styles from './style.less'

const Messages = (params: any): JSX.Element => {
	const [activeKey, setActiveKey] = useState<string | undefined>(params.location.state?.key)
	const [conversationsData, setConversationsData] = useState<ConversationResponseType | null>(null)
	const [isLoading, setIsLoading] = useState(true)
	const [activeConversationId, setActiveConversationId] = useState<string | null>(null)
	const [lastMessageFromSocket, setLastMessageFromSocket] = useState<{
		conversation_id: string,
		from: string,
		body: string
	} | null>(null)
	const [paginationValue, setPaginationValue] = useState(0)

	const globalState = useSelector((state: any) => state.global)
	const wss = socketConnection(globalState.accessToken)
	const user = useSelector((state: any) => state.user.attributes.user)
	const dispatch = useDispatch()

	useEffect(() => {
		fetchUsersConversations(globalState.accessToken, paginationValue)
			.then(({ data }) => {
				setConversationsData(data.attributes)
				if (isLoading) setIsLoading(false)
			})
	}, [paginationValue])

	useEffect(() => {
		if (!isLoading) {
			wss.on('pingMessage', (incMessage: {
				conversation_id: string,
				from: string,
				body: string
			}) => {
				setLastMessageFromSocket(incMessage)
			})
		}
	}, [isLoading])

	useEffect(() => {
		if (lastMessageFromSocket) {
			if (activeConversationId !== lastMessageFromSocket.conversation_id) {
				dispatch({
					type: INCREASE_UNREAD_MESSAGE_VALUE,
					id: lastMessageFromSocket.conversation_id,
					value: 1
				})
			}
			else {
				fetchMessagesByConversationId(globalState.accessToken, lastMessageFromSocket.conversation_id, 0)
				setLastMessageFromSocket(null)
			}
		}
	}, [activeConversationId, lastMessageFromSocket])

	useEffect(() => {
		if (lastMessageFromSocket && paginationValue === 0 &&
			!conversationsData?.conversations.find(item => item._id === lastMessageFromSocket.conversation_id)?._id) {
			setConversationsData({
				...conversationsData,
				conversations: [
					...conversationsData.conversations,
					{
						_id: lastMessageFromSocket.conversation_id,
						participants: [user.username, lastMessageFromSocket.from]
					}
				]
			})
			// It gets the unread values from dispatch of INCREASE_UNREAD_MESSAGE_VALUE already
			// Following dispatch is only for saving new conversation to the state
			dispatch({
				type: SET_UNREAD_MESSAGES_INFO,
				data: {
					values_by_conversations: [
						...globalState.unreadMessageInfo.values_by_conversations,
						{
							id: lastMessageFromSocket.conversation_id,
							value: 0
						}
					],
					total_unread_value: globalState.unreadMessageInfo.total_unread_value
				}
			})
		}
	}, [lastMessageFromSocket])

	useEffect(() => {
		if (activeConversationId && activeKey) {
			dispatch({
				type: DECREASE_UNREAD_MESSAGE_VALUE,
				id: activeConversationId,
				value: globalState.unreadMessageInfo.values_by_conversations.find((item: any) => item.id && item.id === activeConversationId).value
			})
		}
	}, [activeKey])

	if (isLoading) return <PageLoading />

	const handleConversationDelete = (conversationId: string): void => {
		setActiveKey(undefined)
		setActiveConversationId(null)
		deleteConversation(globalState.accessToken, conversationId)
		setConversationsData({
			...conversationsData,
			conversations: [...conversationsData.conversations].filter(item => item._id !== conversationId)
		})
	}

	const handleMessageTabs = (): JSX.Element => {
		const tabPanes = conversationsData.conversations.map((conversation: any) => {
			const recipientUsername = conversation.participants[0] === user.username ?
				conversation.participants[1]
				:
				conversation.participants[0]
			return (
				<Tabs.TabPane
					tab={
						<Badge
							count={globalState.unreadMessageInfo?.values_by_conversations.find((item: any) => item.id == conversation._id).value}
						>
							<Avatar
								src={`${API_URL}/v1/user/pp?username=${recipientUsername}`}
							/>
						</Badge>
					}
					key={recipientUsername}
				>
					<ChatScreen
						wss={wss}
						onOpen={activeKey}
						globalState={globalState}
						username={user.username}
						conversationId={conversation._id}
						recipientUsername={recipientUsername}
						deleteConversationFromState={(): void => handleConversationDelete(conversation._id)}
					/>
				</Tabs.TabPane>
			)
		})

		const handleTabChange = (tabKey: string): void => {
			setActiveConversationId(conversationsData.conversations.find(item => item.participants.includes(tabKey))?._id)
			setActiveKey(tabKey)
		}

		return (
			<>
				<Pagination
					style={{
						position: 'relative',
						top: -10,
						left: -30,
						fontSize: 15,
						padding: '0px 0px 0px 10px'
					}}
					onChange={(page: number): void => {
						setActiveKey(undefined)
						setPaginationValue(10 * (page - 1))
					}}
					simple
					hideOnSinglePage
					defaultCurrent={1}
					total={conversationsData.count}
				/>
				<Tabs
					destroyInactiveTabPane
					style={{ marginLeft: -25 }}
					className={conversationsData.conversations.length === 0 ? styles.hideMessageBar : undefined}
					activeKey={activeKey}
					tabPosition="left"
					size="small"
					onChange={handleTabChange}
					animated={false}
				>
					{tabPanes}
					{!activeKey && (
						<div
							style={{
								display: 'flex',
								flexDirection: 'column',
								justifyContent: 'center',
								alignItems: 'center',
								height: 600
							}}
						>
							<img style={{ opacity: 0.65 }} src={conversationImg} width="150" alt="Conversation Png" />
							<Typography.Paragraph style={{ textAlign: 'center', width: 275 }} strong>
								Direct Messages are private conversations
								between you and other people on Feednext
							</Typography.Paragraph>
							<Button
								shape="round"
								onClick={(): void => router.push('/messages/compose')}
							>
								Start a Conversation
							</Button>
						</div>
					)}
				</Tabs>
			</>
		)
	}

	return (
		<>
			<Card style={{ overflow: 'scroll', height: 750, overflowX: 'hidden' }} className={styles.globalClass}>
				{handleMessageTabs()}
			</Card>
			<br/>
		</>
	)
}

export default Messages
