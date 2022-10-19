// Antd dependencies
import { Row, Upload, Col, Form, Divider, Input, Button, Avatar, message } from 'antd'
import { LoadingOutlined, UploadOutlined } from '@ant-design/icons'

// Other dependencies
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

// Local files
import { uploadProfilePicture, updateUser } from '@/services/api'
import { UPDATE_USER } from '@/redux/Actions/User'
import { API_URL } from '@/../config/constants'

export const AccountSettings = (params: AccountSettingsParams): JSX.Element => {
	const [imageUri, setImageUri] = useState(`${API_URL}/v1/user/pp?username=${params.user.username}`)
	const [isImageLoading, setIsImageLoading] = useState(false)
	const [imageSource, setImageSource] = useState<string | null>(null)
	const [sendingChanges, setSendingChanges] = useState(false)

	const [form] = Form.useForm()
	const dispatch = useDispatch()

	useEffect(() => {
		if (sendingChanges && imageSource) {
			const formData = new FormData()
			formData.append('image', imageSource)
			uploadProfilePicture(formData, params.accessToken)
				.then(_res => message.info('Refresh page to see the new picture', 3))
				.catch(error => {
					if (error.response) {
						message.error('File must be an image')
						return
					}
					message.error('Image size can not be higher than 2M')
				})
		}
	}, [imageSource, sendingChanges])

	const handleSubmit = async (values: AccountUpdatePayload): Promise<void> => {
		setSendingChanges(true)
		const payload: AccountUpdatePayload = {
			...(values.fullName !== params.user.full_name && { fullName: values.fullName }),
			...(values.email !== params.user.email && { email: values.email }),
			...(values.biography !== params.user.biography && { biography: values.biography }),
			...(values.link !== params.user.link && { link: values.link }),
			...(values.oldPassword && { oldPassword: values.oldPassword }),
			...(values.password && { password: values.password }),
		}

		await updateUser(params.accessToken, payload)
			.then(_res => {
				setSendingChanges(false)
				dispatch({
					type: UPDATE_USER,
					payload: {
						...(values.fullName !== params.user.full_name && { fullName: values.fullName }),
						...(values.link !== params.user.link && { link: values.link }),
						...(values.biography !== params.user.biography && { biography: values.biography }),
					},
				})
				if (values.email !== params.user.email) {
					message.info('Verification mail has been sent to your new email address')
				}
				message.success('Changes are saved', 3)
			})
			.catch(error => {
				setSendingChanges(false)
				message.error(error.response.data.message)
			})
	}

	const fileValidation = (file: File): boolean => {
		const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
		if (!isJpgOrPng) message.error('You can only upload JPG/PNG file!')

		const isBiggerThan2Mb = file.size / 1024 / 1024 > 2
		if (isBiggerThan2Mb) message.error('Image must smaller than 2MB!')

		return isJpgOrPng && !isBiggerThan2Mb
	}

	const getBase64 = (image: File, callback: Function): void => {
		const reader = new FileReader()
		reader.addEventListener('load', () => callback(reader.result))
		reader.readAsDataURL(image)
	}

	const handleChangePicture = (fileInfo: any): void => {
		if (fileInfo.file.status === 'uploading') {
			setIsImageLoading(true)
			return
		}

		if (fileInfo.file.status === 'done') {
			setIsImageLoading(false)
			// Get this url from response in real world.
			getBase64(fileInfo.file.originFileObj, (base64Url: string) => {
				setImageUri(base64Url)
				setImageSource(fileInfo.file.originFileObj)
			})
		}
	}
	return (
		<Row className={'account-settings-tab'}>
			<Col lg={9} md={11} sm={13} xs={24}>
				<Form
					initialValues={{
						fullName: params.user.full_name,
						email: params.user.email,
						link: params.user.link,
						biography: params.user.biography,
					}}
					form={form}
					onFinish={handleSubmit}
					scrollToFirstError
				>
					<Divider> Full Name </Divider>
					<Form.Item name="fullName">
						<Input placeholder="Full Name" />
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
						<Input placeholder="Email" />
					</Form.Item>

					<Divider> Password </Divider>
					<Form.Item
						name="oldPassword"
						rules={[
							{
								min: 6,
								message: 'Password length must be equal or longer than 6',
							},
							({ getFieldValue }) => ({
								required: getFieldValue('password'),
								message: 'Please enter your current password!',
							}),
						]}
						style={{ marginBottom: 10 }}
					>
						<Input.Password placeholder="Current Password" />
					</Form.Item>
					<Form.Item
						style={{ marginBottom: 10 }}
						name="password"
						rules={[
							{
								min: 6,
								message: 'Password length must be equal or longer than 6',
							},
						]}
					>
						<Input.Password placeholder="New Password" />
					</Form.Item>
					<Form.Item
						name="password-confirm"
						dependencies={['password']}
						hasFeedback
						rules={[
							{
								min: 6,
								message: 'Password length must be equal or longer than 6',
							},
							({ getFieldValue }) => ({
								required: getFieldValue('password'),
								message: 'Please confirm your password!',
							}),
							({ getFieldValue }) => ({
								validator(rule, value) {
									if (value && getFieldValue('password') !== value) {
										return Promise.reject('The two passwords that you entered do not match!')
									}
									return Promise.resolve()
								},
							}),
						]}
					>
						<Input.Password placeholder="Confirm New Password" />
					</Form.Item>
					<Divider> Link </Divider>
					<Form.Item name="link">
						<Input maxLength={90} placeholder="Link" />
					</Form.Item>
					<Divider> Biography </Divider>
					<Form.Item name="biography">
						<Input.TextArea
							autoSize={{ maxRows: 2, minRows: 2 }}
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
			<Col sm={5} xs={24} style={{ textAlign: 'center' }}>
				<Avatar
					style={{ marginBottom: 12 }}
					size={200}
					src={imageUri}
					alt="User Image"
				/>
				<br />
				<Upload
					beforeUpload={fileValidation}
					onChange={handleChangePicture}
					showUploadList={false}
					accept=".jpg, .jpeg, .png"
				>
					{isImageLoading ? (
						<Button style={{ width: 200 }} shape="round" icon={<LoadingOutlined />}>
							Uploading
						</Button>
					) : (
						<Button style={{ width: 200 }} shape="round" icon={<UploadOutlined />}>
							Change Picture
						</Button>
					)}
				</Upload>
			</Col>
		</Row>
	)
}
