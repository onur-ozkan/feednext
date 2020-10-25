// Antd dependencies
import { Card, Form, Input, Button, AutoComplete, Typography, Avatar, message } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'

// Other dependencies
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useRouter, NextRouter } from 'next/router'

// Local files
import { searchUser, fetchUserByUsername } from '@/services/api'
import { socketConnection } from '@/services/socket.service'
import { PageHelmet } from '@/components/global/PageHelmet'
import { FormDataType } from '@/@types/pages'
import { API_URL } from '@/../config/constants'
import { AppLayout } from '@/layouts/AppLayout'
import { Roles } from '@/enums'


const Compose: React.FC = (): JSX.Element => {
	const globalState = useSelector((state: any) => state.global)
	const router: NextRouter & { query: { username?: string } } = useRouter()

	const wss = socketConnection(globalState.accessToken)
	const [form] = Form.useForm()

	const [userFilterInput, setUserFilterInput] = useState<string>(router.query.username || '')
	const [autoCompleteData, setAutoCompleteData] = useState(undefined)
	const [messageForm, setMessageForm] = useState<{ to: string | null, body: string | null }>({
		to: null,
		body: null,
	})
	const [noDataMessage, setNoDataMessage] = useState('')

	const handleMessageSending = async (formValues: FormDataType): Promise<void> => {
		await form.validateFields()
		await fetchUserByUsername(formValues.recipient).then(() => {
			wss.emit('sendMessage', formValues)
			router.push('/messages')
		})
		.catch(_error => message.error('User not found'))
	}

	useEffect(() => {
		if (userFilterInput === '') {
			setAutoCompleteData(undefined)
			setMessageForm({ ...messageForm, to: null })
		}
		if (userFilterInput.length < 3) setNoDataMessage('Enter at least 3 characters to search')
		else {
			searchUser(userFilterInput).then(({ data }) => {
				const foundUsers = data.attributes.users.map((user: any) => {
					return {
						value: user.username,
						label: (
							<Typography.Text ellipsis style={{ fontSize: 16 }}>
								<Avatar
									style={{ marginRight: 5 }}
									size="small"
									src={`${API_URL}/v1/user/pp?username=${user.username}`}
									alt="User Image"
								/>
								<Typography.Text> {user.full_name} </Typography.Text>
								<Typography.Text strong> @{user.username}</Typography.Text>
							</Typography.Text>
						),
					}
				})
				if (foundUsers.length === 0) {
					setAutoCompleteData(undefined)
					setMessageForm({ ...messageForm, to: null })
				} else setAutoCompleteData(foundUsers)
				setNoDataMessage('Could not match anything')
			}).catch(_error => {})
		}
	}, [userFilterInput])

	const handleOnSelect = (username: string): void => setMessageForm({ ...messageForm, to: username })

	return (
		<AppLayout authority={Roles.User}>
			<PageHelmet
				title="Send Message"
				description="Best reviews, comments, feedbacks about anything around the world"
				mediaImage="https://avatars1.githubusercontent.com/u/64217221?s=200&v=4"
				mediaDescription="Best reviews, comments, feedbacks about anything around the world"
			/>
			<Card style={{ padding: 0, minHeight: 500 }}>
				<Button
					onClick={() => router.back()}
					shape="circle"
					icon={<ArrowLeftOutlined />}
					style={{ marginBottom: 25 }}
				/>

				<Form form={form} onFinish={handleMessageSending} initialValues={{ recipient: userFilterInput }}>
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
							defaultActiveFirstOption
							dropdownClassName="certain-category-search-dropdown"
							notFoundContent={
								<Typography.Text strong style={{ width: '100%' }}>{noDataMessage}</Typography.Text>
							}
							value={userFilterInput}
							onChange={(value: string): void => setUserFilterInput(value)}
							onSelect={handleOnSelect}
							options={autoCompleteData}
						>
							<Input.Search
								size="large"
								placeholder="Enter username"
							/>
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
		</AppLayout>
	)
}

export default Compose
