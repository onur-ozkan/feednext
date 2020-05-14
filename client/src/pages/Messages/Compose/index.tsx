// Antd dependencies
import { Card, Form, Input, Button, AutoComplete, Typography, Avatar, message } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'

// Other dependencies
import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { router } from 'umi'

// Local files
import { searchUser, fetchUserByUsername, fetchUnreadMessageInfo } from '@/services/api'
import { API_URL } from '@/../config/constants'
import { socketConnection } from '@/services/socket'
import { SET_UNREAD_MESSAGES_INFO } from '@/redux/Actions/Global'

export declare interface FormDataType {
	recipient: string
	body: string
}

const Compose = (): JSX.Element => {
	const [userFilterInput, setUserFilterInput] = useState<string>('')
	const [autoCompleteData, setAutoCompleteData] = useState(undefined)
	const [messageForm, setMessageForm] = useState({
		to: null,
		body: null,
	})
	const globalState = useSelector((state: any) => state.global)

	const wss = socketConnection(globalState.accessToken)
	const [form] = Form.useForm()
	const dispatch = useDispatch()


	const handleMessageSending = async (formValues: FormDataType): Promise<void> => {
		await form.validateFields()
		await fetchUserByUsername(formValues.recipient).then(async () => {
			wss.emit('sendMessage', formValues)
			// Refresh unread message state with new conversation before routing there
			await fetchUnreadMessageInfo(globalState.accessToken).then(({ data }) => {
				dispatch({
					type: SET_UNREAD_MESSAGES_INFO,
					data: data.attributes
				})
				router.push({
					pathname: '/messages',
					state: {
						key: formValues.recipient
					}
				})
			})
		})
		.catch(_error => message.error('User not found'))
	}

	useEffect(() => {
		if (userFilterInput === '') {
			setAutoCompleteData(undefined)
			setMessageForm({ ...messageForm, to: null })
		}
		if (userFilterInput.length > 2) {
			searchUser(userFilterInput).then(({ data }) => {
				const foundUsers = data.attributes.users.map((user: any) => {
					return {
						value: user.username,
						label: (
							<div
								onClick={(): void => {
									setMessageForm({ ...messageForm, to: user.username })
								}}
							>
								<Typography.Text ellipsis style={{ fontSize: 16 }}>
									<Avatar
										style={{ marginRight: 5 }}
										size="small"
										src={`${API_URL}/v1/user/pp?username=${user.username}`}
									/>
									<Typography.Text> {user.full_name} </Typography.Text>
									<Typography.Text strong> @{user.username}</Typography.Text>
								</Typography.Text>
							</div>
						),
					}
				})
				if (foundUsers.length === 0) {
					setAutoCompleteData(undefined)
					setMessageForm({ ...messageForm, to: null })
				} else setAutoCompleteData(foundUsers)
			})
		}
	}, [userFilterInput])

	return (
		<>
			<Card style={{ padding: 0, minHeight: 500 }}>
				<Button
					onClick={(): void => router.goBack()}
					shape="circle"
					icon={<ArrowLeftOutlined />}
					style={{ marginBottom: 25 }}
				/>

				<Form form={form} onFinish={handleMessageSending}>
					<Form.Item
						style={{ marginBottom: 10 }}
						name="recipient"
						rules={[
							{
								required: true,
								message: 'Provide a username to send the message',
							},
						]}
					>
						<AutoComplete
							dropdownClassName="certain-category-search-dropdown"
							value={userFilterInput}
							onChange={(value: string): void => {
								setUserFilterInput(value)
								setMessageForm({ ...messageForm, to: value })
							}}
							options={autoCompleteData}
						>
							<Input.Search size="large" placeholder="Enter username" />
						</AutoComplete>
					</Form.Item>
					<Form.Item
						style={{ margin: 0 }}
						name="body"
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
					>
						<Input.TextArea placeholder="Write a messageForm..." rows={4} />
					</Form.Item>
					<Form.Item style={{ float: 'right' }}>
						<Button htmlType="submit">
							Send
						</Button>
					</Form.Item>
				</Form>
			</Card>
			<br />
		</>
	)
}

export default Compose
