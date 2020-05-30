// Antd dependencies
import { Form, Input, Tabs, Button, notification, message } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'

// Other dependencies
import React, { useState } from 'react'
import { history } from 'umi'

// Local files
import { PageHelmet } from '@/components/PageHelmet'
import { recoverAccountWithKey } from '@/services/api'
import NotFoundPage from '@/pages/404'
import styles from './style.less'

const AccountRecover: React.FunctionComponent = (props: any) => {
	const [requestOnGoing, setRequestOnGoing] = useState(false)
	const [form] = Form.useForm()

	if (!props.location.query?.email || !props.location?.query?.recoveryKey) return <NotFoundPage />

	console.log(props.location.query?.email, props.location?.query?.recoveryKey)
	const onSubmit = ({ password }: { password: string}) => {
		setRequestOnGoing(true)

		recoverAccountWithKey({
			email: props.location.query?.email,
			recoveryKey: props.location.query?.recoveryKey,
			password
		}).then(() => {
			message.success('Password updated successfully')
			history.push('/auth/sign-in')
		}).catch(({ response }) => {
			notification.error({
				message: 'Error',
				description: response.data.message,
				placement: 'topLeft'
			})
		})
	}

	const handleSubmitButtonView = () => (
		<Button style={{ width: '100%' }} size="large" type="primary" htmlType="submit">
			{requestOnGoing ? <LoadingOutlined /> : 'Change Password'}
		</Button>
	)

	return (
		<>
			<PageHelmet
				title="Change Password | Feednext"
				description="Best reviews, comments, feedbacks about anything around the world"
				mediaImage="https://avatars1.githubusercontent.com/u/64217221?s=200&v=4"
				mediaDescription="Best reviews, comments, feedbacks about anything around the world"
			/>
			<div className={styles.main}>
				<Form form={form} name="sign-in" onFinish={onSubmit} size="middle" scrollToFirstError>
					<Tabs>
						<Tabs.TabPane
							key="change-password"
							tab="Change Password"
						>
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
							<Form.Item>
								{handleSubmitButtonView()}
							</Form.Item>
						</Tabs.TabPane>
					</Tabs>
				</Form>
			</div>
		</>
	)
}

export default AccountRecover
