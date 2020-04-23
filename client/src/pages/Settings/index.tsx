import React, { useEffect, useState } from 'react'
import { Card, Tabs, Typography, Row, Col, Avatar, Input, Button, Divider, Form, Upload, message } from 'antd'
import { UserOutlined, LoadingOutlined, SettingOutlined, UploadOutlined } from '@ant-design/icons'
import styles from './index.less'
import { API_URL } from '../../../config/constants'
import { useSelector, useDispatch } from 'react-redux'
import { updateUser, uploadProfilePicture } from '@/services/api'
import { UPDATE_USER } from '@/redux/Actions/User/types'

interface UpdatePayload {
	fullName?: string
	email?: string
	biography?: string
	oldPassword?: string
	password?: string
}

const Settings = (): JSX.Element => {
	const user = useSelector((state: any) => state.user?.attributes.user)
	const accessToken = useSelector((state: any) => state.global.accessToken)

	const [form] = Form.useForm()
	const dispatch = useDispatch()

	const [activeTab, setActiveTab] = useState('account')
	const [imageSource, setImageSource] = useState(null)
	const [sendingChanges, setSendingChanges] = useState(false)
	const [tabView, setTabView] = useState<JSX.Element>(
		<div style={{ textAlign: 'center' }}>
			<LoadingOutlined style={{ fontSize: 20 }} />
		</div>
	)

	useEffect(() => {
		if (sendingChanges && imageSource) {
			const formData = new FormData()
			formData.append('image', imageSource)
			uploadProfilePicture(formData, accessToken)
				.then((_res) => message.info('Refresh page to see the new picture', 3))
				.catch(error => {
					if (error.response) {
						message.error('File must be an image')
						return
					}
					message.error('Image size can not be higher than 2M')
				})
		}
	}, [imageSource, sendingChanges])

	const handleSubmit = async (values: UpdatePayload): Promise<void> => {
		setSendingChanges(true)
		const payload: UpdatePayload = {
			...(values.fullName !== user.full_name) && { fullName: values.fullName },
			...(values.email !== user.email) && { email: values.email },
			...(values.biography !== user.biography) && { biography: values.biography },
			...(values.oldPassword) && { oldPassword: values.oldPassword },
			...(values.password) && { password: values.password },
		}

		await updateUser(user.username, accessToken, payload)
			.then(_res => {
				setSendingChanges(false)
				dispatch({
					type: UPDATE_USER,
					payload: {
						...(values.fullName !== user.full_name) && { fullName: values.fullName },
						...(values.biography !== user.biography) && { biography: values.biography },
					}
				})
				message.success('Changes are saved', 3)
			})
			.catch(error => message.error(error.response.data.message))
	}

	const handleChangePicture = (fileInfo: any): void => setImageSource(fileInfo.file.originFileObj)

	const handleAccountTabView = (): void => {
		setTabView(
			<Row className={styles.settings}>
				<Col lg={9} md={11} sm={14}>
					<Form
						initialValues={{
							fullName: user.full_name,
							email: user.email,
							biography: user.biography
						}}
						form={form}
						onFinish={handleSubmit}
						scrollToFirstError
					>
						<Divider> Full Name </Divider>
						<Form.Item name="fullName">
							<Input placeholder="Full Name"/>
						</Form.Item>
						<Divider> Email </Divider>
						<Form.Item
							name="email"
							rules={[
								{
									type: 'email',
									message: 'The is not a valid Email',
								},
								{
									required: true,
									message: 'Please enter your Email!',
								},
							]}
						>
							<Input placeholder="Email"/>
						</Form.Item>

						<Divider> Password </Divider>
						<Form.Item
							name="oldPassword"
							rules={[
								{
									min: 6,
									message: 'Password length must be equal or longer than 6'
								},
								({ getFieldValue }) => ({
									required: getFieldValue('password'),
									message: 'Please enter your current password!',
								})
							]}
							style={{ marginBottom: 0 }}
						>
							<Input.Password style={{ marginBottom: 10 }} placeholder="Current Password" />
						</Form.Item>
						<Form.Item
							name="password"
							rules={[
								{
									min: 6,
									message: 'Password length must be equal or longer than 6'
								}
							]}
						>
							<Input.Password style={{ marginBottom: 10 }} placeholder="New Password" />
						</Form.Item>
						<Form.Item
							name="password-confirm"
							dependencies={['password']}
							hasFeedback
							rules={[
								{
									min: 6,
									message: 'Password length must be equal or longer than 6'
								},
								({ getFieldValue }) => ({
									required: getFieldValue('password'),
									message: 'Please confirm your password!',
								}),
								({ getFieldValue }) => ({
									validator(rule, value) {
										if (!value || getFieldValue('password') === value) {
											return Promise.resolve()
										}
										return Promise.reject('The two passwords that you entered do not match!')
									},
								}),
							]}
						>
							<Input.Password placeholder="Confirm New Password" />
						</Form.Item>
						<Divider> Biography </Divider>
						<Form.Item name="biography">
							<Input.TextArea
								autoSize={{ maxRows: 2, minRows: 2}}
								allowClear
								maxLength={155}
								style={{ marginBottom: 20 }}
								placeholder="Biography"
							/>
						</Form.Item>
						<Form.Item>
							<Button style={{ width: '100%' }} loading={sendingChanges} type="default" htmlType="submit">
								Save Changes
							</Button>
						</Form.Item>
					</Form>
				</Col>
				<Col span={2} />
				<Col sm={4} style={{ textAlign: 'center' }}>
					<Avatar
						style={{ marginBottom: 12 }}
						shape="square"
						size={200}
						src={`${API_URL}/v1/user/${user.username}/pp`}
					/>
					<br/>
					<Upload onChange={handleChangePicture} accept=".jpg, .jpeg, .png">
						<Button type="link">
							<UploadOutlined /> Change Picture
						</Button>
					</Upload>
				</Col>
			</Row>
		)
	}

	const handleApplicationTabView = (): void => {
		setTabView(
			<div style={{ textAlign: 'center' }}>
				<LoadingOutlined style={{ fontSize: 20 }} />
			</div>
		)
	}

	useEffect(() => {
		switch (activeTab) {
			case 'account':
				handleAccountTabView()
			break
		case 'application':
			handleApplicationTabView()
			break
		}
	}, [activeTab])

	const handleTabChange = (key: string): void => setActiveTab(key)

	return (
		<Card>
			<Tabs size="default" tabPosition="top" animated={false} defaultActiveKey="profile" onChange={handleTabChange}>
				<Tabs.TabPane
					tab={
						<Typography.Text strong>
							<UserOutlined style={{ margin: 0 }} /> Account Settings
						</Typography.Text>
					}
					key="account"
				>
					{tabView}
				</Tabs.TabPane>
				<Tabs.TabPane
					tab={
						<Typography.Text strong>
							<SettingOutlined style={{ margin: 0 }} /> Application Settings
						</Typography.Text>
					}
					key="application"
				>
					{tabView}
				</Tabs.TabPane>
			</Tabs>
		</Card>
	)
}

export default Settings
