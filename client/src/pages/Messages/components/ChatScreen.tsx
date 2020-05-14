/* eslint-disable @typescript-eslint/camelcase */
// Antd dependencies
import { Avatar, List, Input, Button, Form, Divider, Row, Col, Typography, Popconfirm } from 'antd'
import { DeleteFilled, WarningOutlined } from '@ant-design/icons'

// Other dependencies
import React, { useState, useEffect } from 'react'
import { format, parseISO, formatISO } from 'date-fns'
import { Link } from 'umi'

// Local files
import { fetchMessagesByConversationId, fetchUserByUsername } from '@/services/api'
import { API_URL } from '@/../config/constants'
import PageLoading from '@/components/PageLoading'

const ChatScreen = (params: any) => {
	const [messageList, setMessageList] = useState<any[]>([])
	const [paginationValue, setPaginationValue] = useState(0)
	const [recipientProfile, setRecipientProfile] = useState(null)
	const [form] = Form.useForm()

	useEffect(() => {
		fetchMessagesByConversationId(params.globalState.accessToken, params.conversationId, paginationValue)
			.then(({ data }) => {
				data.attributes.messages.map(item => {
					setMessageList((currentState: any) => [item, ...currentState])
				})
			})
	}, [paginationValue])

	useEffect(() => {
		fetchUserByUsername(params.recipientUsername).then(({ data }) => setRecipientProfile(data))
	}, [params.onOpen])

	useEffect(() => {
		params.wss.on('pingMessage', (incMessage: {
			conversation_id: string,
			from: string,
			body: string
		}) => {
			if (params.conversationId === incMessage.conversation_id) {
				setMessageList((messageList: any) => [...messageList, {
					send_by: incMessage.from,
					text: incMessage.body,
					created_at: formatISO(new Date)
				}])
			}
		})
	}, [])

	if (!messageList.length > 0 || !recipientProfile) return <PageLoading />

	const renderMessages = (item, index) => {
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

	const handleMessageSend = async (values: { messageText: string }): Promise<void> => {
		await form.validateFields()

		params.wss.emit('sendMessage', {
			recipient: params.recipientUsername,
			body: values.messageText
		})
		setMessageList((messageList: any) => [...messageList, {
			send_by: params.username,
			text: values.messageText,
			created_at: formatISO(new Date)
		}])

		form.resetFields()
	}

	const handleFetchingPreviousMessages = (): void => setPaginationValue(paginationValue + 10)

	const loadMore = (messageList.length % 10) === 0  && (
		<div style={{ textAlign: 'center', marginTop: 10 }}>
			<Button
				onClick={handleFetchingPreviousMessages}
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
		<div style={{ padding: '10px 0px 0px 10px' }}>
			<Row style={{ display: 'flex', alignItems: 'center', marginBottom: 5 }}>
				<Col>
					<Typography.Text style={{ fontSize: 25 }}> {recipientProfile.attributes.full_name} </Typography.Text>
				</Col>
				<Popconfirm
					placement="bottomLeft"
					style={{ fontSize: 15 }}
					icon={<WarningOutlined style={{ color: 'red' }} />}
					title="Are you sure to delete this conversation?"
					onConfirm={params.deleteConversationFromState}
					okText="Yes"
					cancelText="No"
				>
				<Button
					type="link"
					danger
					icon={<DeleteFilled />}
				/>
				</Popconfirm>
			</Row>
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
					<Button htmlType="submit"> Send </Button>
				</Form.Item>
			</Form>
		</div>
	)
}

export default ChatScreen
