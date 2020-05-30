// Antd dependencies
import { Button, Divider, Form, List, Avatar, Input } from 'antd'

// Other dependencies
import React, { useState, useEffect, useRef } from 'react'
import { format, parseISO, formatISO } from 'date-fns'
import { useDispatch } from 'react-redux'
import { Link } from 'umi'

// Local files
import { fetchMessagesByConversationId, fetchUserByUsername } from '@/services/api'
import { ChatScreenProps, MessageAttributes } from '../../types'
import { DECREASE_UNREAD_MESSAGE_VALUE } from '@/redux/Actions/Global'
import { GetUserDataResponse } from '@/@types/api'
import { MessageHeader } from '../MessageHeader'
import { API_URL } from '@/../config/constants'
import PageLoading from '@/components/PageLoading'

export const ChatScreen: React.FC<ChatScreenProps> = (props): JSX.Element => {
	const [messageList, setMessageList] = useState<any[]>([])
	const [paginationValue, setPaginationValue] = useState(0)
	const [recipientProfile, setRecipientProfile] = useState<GetUserDataResponse | null>(null)
	const [canPaginate, setCanPaginate] = useState(false)

	const dispatch = useDispatch()
	const [form] = Form.useForm()
	const bottomEl = useRef<HTMLDivElement>()

	// Initialization for each conversation that shown on
	useEffect(() => {
		// Reset pagination value
		setPaginationValue(0)

		// Clear message list state
		setMessageList([])

		// Listen incoming messages
		props.wss.on('pingMessage', (incMessage: {
			conversation_id: string,
			from: string,
			body: string
		}) => {
			if (props.conversationId === incMessage.conversation_id) {
				setMessageList((messageList: any) => [...messageList, {
					send_by: incMessage.from,
					text: incMessage.body,
					created_at: formatISO(new Date)
				}])
				bottomEl.current?.scrollIntoView({
					behavior: 'smooth',
					block: 'start'
				})
			}
		})

		// Get recipient's user attributes
		fetchUserByUsername(props.recipientUsername).then(({ data }) => setRecipientProfile(data))

		// Delete unread value if exists
		dispatch({
			type: DECREASE_UNREAD_MESSAGE_VALUE,
			id: props.conversationId,
			value: props.globalState.unreadMessageInfo.values_by_conversations.find((item: any) => item.id && item.id === props.conversationId)?.value
		})

		// Cut wss connection off on close
		return (): void => {
			props.wss.close()
		}
	}, [props.conversationId])


	useEffect(() => {
		fetchMessagesByConversationId(props.globalState.accessToken, props.conversationId, paginationValue)
			.then(async ({ data }) => {
				await data.attributes.messages.map((item: any) => setMessageList((currentState) => [item, ...currentState]))
				if (data.attributes.count > messageList.length) setCanPaginate(true)
				else setCanPaginate(false)
			})
	}, [paginationValue, props.conversationId])

	// Scroll to message input when page is rendered
	useEffect(() => {
		if (messageList.length !== 0 && messageList.length <= 10 && recipientProfile) {
			bottomEl.current?.scrollIntoView({
				behavior: 'smooth',
				block: 'start'
			})
		}
	}, [messageList, recipientProfile])

	if (messageList.length === 0 || !recipientProfile) return <PageLoading />

	const handleMessageSend = async (values: { messageText: string }): Promise<void> => {
		await form.validateFields()

		props.wss.emit('sendMessage', {
			recipient: props.recipientUsername,
			body: values.messageText
		})
		setMessageList((messageList: any) => [...messageList, {
			send_by: props.username,
			text: values.messageText,
			created_at: formatISO(new Date)
		}])
		bottomEl.current?.scrollIntoView({
			behavior: 'smooth',
			block: 'start'
		})

		form.resetFields()
	}


	const renderMessages = (item: MessageAttributes, index: number) => {
		if (index !== 0	&&
				format(parseISO(messageList[index - 1].created_at), 'dd LLL (p O)') === format(parseISO(item.created_at), 'dd LLL (p O)') &&
				messageList[index - 1].send_by === item.send_by
		) {
			return (
				<List.Item.Meta
					style={{ marginTop: -25 }}
					avatar={<Avatar style={{ visibility: 'hidden' }} />}
					description={<span style={{ color: '#333' }}> {item.text} </span>}
				/>
			)
		}

		return (
			<List.Item.Meta
				avatar={<Avatar src={`${API_URL}/v1/user/pp?username=${item.send_by}`} />}
				title={
					<>
						<Link to={`user/${item.send_by}`} style={{ fontWeight: 'bold', color: '#212121' }}>
							{item.send_by}
						</Link>
						<span style={{ color: 'gray', fontSize: 12 }}> {format(parseISO(item.created_at), 'dd LLL (p O)')} </span>
					</>
				}
				description={<span style={{ color: '#333' }}> {item.text} </span>}
			/>
		)
	}

	const loadMore = canPaginate  && (
		<div style={{ textAlign: 'center', marginTop: 10 }}>
			<Button
				onClick={(): void => setPaginationValue(paginationValue + 10)}
				type="link"
				style={{
					paddingLeft: 48,
					paddingRight: 48,
					fontSize: 12
				}}
			>
				Load More Messages
			</Button>
		</div>
	)

	return (
		<>
			<MessageHeader
				title={recipientProfile.attributes.full_name}
				onDelete={props.deleteConversation}
			/>
			<div
				style={{
					display: 'flex',
					padding: '0px 50px 50px 50px',
					flexDirection: 'column',
					overflow: 'scroll',
					overflowX: 'hidden',
					height: 750
				}}
			>
				<Divider style={{ margin: 0, padding: 0 }} />
				{loadMore}
				<List
					style={{ marginTop: 10 }}
					itemLayout="horizontal"
					dataSource={messageList}
					renderItem={(item, index) => (
						<List.Item style={{ borderBottom: 0 }}>{renderMessages(item, index)}</List.Item>
					)}
				/>
				<Divider style={{ backgroundColor: 'transparent' }}/>
				<Form form={form} onFinish={handleMessageSend}>
					<Form.Item
						name="messageText"
						rules={[
							{ required: true, message: 'Write a message to send it' },
							() => ({
								validator(rule, value) {
									if (value && value.trim().length === 0) {
										return Promise.reject('Blank messages can not send')
									}
									return Promise.resolve()
								},
							})
						]}
						style={{ margin: 0 }}
					>
						<Input.TextArea rows={4} />
					</Form.Item>
					<Form.Item style={{ float: 'right' }}>
						<div ref={bottomEl}>
							<Button  htmlType="submit"> Send </Button>
						</div>
					</Form.Item>
				</Form>
			</div>
		</>
	)
}
