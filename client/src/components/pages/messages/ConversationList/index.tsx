// Antd dependencies
import { Avatar, Row, Col, List, Pagination, Badge } from 'antd'

// Other dependencies
import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useRouter } from 'next/router'

// Local files
import { INCREASE_UNREAD_MESSAGE_VALUE, ADD_ITEM_TO_MESSAGES_INFO } from '@/redux/Actions/Global'
import { fetchUsersConversations, fetchMessagesByConversationId } from '@/services/api'
import { API_URL } from '@/../config/constants'
import PageLoading from '@/components/global/PageLoading'
import { ConversationListProps } from '@/@types/pages'
import newMessagePng from '@/assets/newMessage.png'

export const ConversationList: React.FC<ConversationListProps> = (props): JSX.Element => {
	const router = useRouter()
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
		props.wss.on('pingMessage', (incMessage: {
			conversation_id: string,
			from: string,
			body: string
		}) => setLastMessageFromSocket(incMessage))

		return (): void => {
			props.wss.close()
		}
	}, [])

	// Fetch current user's conversations and save them to the state
	useEffect(() => {
		fetchUsersConversations(props.globalState.accessToken, paginationValue)
			.then(({ data }) => {
				props.setCurrentConversations(data.attributes)
				if (isLoading) setIsLoading(false)
			})
	}, [paginationValue])

	// Pop a notification on conversation bar when message comes via socket
	useEffect(() => {
		if (lastMessageFromSocket) {

			// Create a conversation baloon if doesnt exists
			if (paginationValue === 0 && !props.currentConversations?.conversations.find(item => item._id === lastMessageFromSocket.conversation_id)?._id) {
				if (props.currentConversations?.conversations.length < 10) {
					props.setCurrentConversations({
						...props.currentConversations,
						conversations: [
							...props.currentConversations.conversations,
							{
								_id: lastMessageFromSocket.conversation_id,
								participants: [props.username, lastMessageFromSocket.from]
							}
						],
					})
				}
				dispatch({
					type: ADD_ITEM_TO_MESSAGES_INFO,
					item: {
						id: lastMessageFromSocket.conversation_id,
						value: 1
					}
				})
				return
			}

			if (props.activeConversationId !== lastMessageFromSocket.conversation_id) {
				dispatch({
					type: INCREASE_UNREAD_MESSAGE_VALUE,
					id: lastMessageFromSocket.conversation_id,
					value: 1
				})
			}
			else {
				fetchMessagesByConversationId(props.globalState.accessToken, lastMessageFromSocket.conversation_id, 0)
				setLastMessageFromSocket(null)
			}
		}
	}, [lastMessageFromSocket])

	if (isLoading) return <PageLoading />

	const handleConversationListView = (): JSX.Element[] => {
		const listView = props.currentConversations.conversations.map((conversation) => {
			const recipientUsername = (conversation.participants[0] === userState.username) ?
				conversation.participants[1] : conversation.participants[0]
			return (
				<Col
					key={conversation._id}
					onClick={(): void => {
						props.setActiveConversation(conversation)
						props.setRecipientUsername(recipientUsername)
					}}
					className={'person'}
					span={24}
				>
					<List.Item.Meta
						style={{ justifyContent: 'center', alignContent: 'center' }}
						avatar={
							<Badge count={props.globalState.unreadMessageInfo?.values_by_conversations.find((item: any) => item.id == conversation._id)?.value}>
								<Avatar
									shape="circle"
									size="large"
									src={`${API_URL}/v1/user/pp?username=${recipientUsername}`}
									alt="Receiver Image"
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
		<div className={'left'}>
			<div style={{ textAlign: 'center' }} className={'top'}>
				<span onClick={() => router.push('/messages/compose')}>
					<Avatar
						style={{ cursor: 'pointer' }}
						shape="square" size="large"
						src={newMessagePng}
						alt="New Message Icon"
					/>
				</span>
			</div>
			<Row className={'people'}>
				{handleConversationListView()}
				<Pagination
					style={{
						position: 'absolute',
						left: 0,
						bottom: 10,
						fontSize: 15,
						padding: '0 0 0 10px',
						zIndex: 1
					}}
					onChange={(page: number): void => {
						props.setActiveConversation(undefined)
						props.setRecipientUsername(undefined)
						setPaginationValue(10 * (page - 1))
					}}
					size="small"
					showLessItems={true}
					showQuickJumper={false}
					hideOnSinglePage
					defaultCurrent={1}
					total={props.currentConversations.count}
				/>
			</Row>
		</div>
	)
}
