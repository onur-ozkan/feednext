// Antd dependencies
import { Form, Input, Tabs, Button, notification, message } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'

// Other dependencies
import React, { useState } from 'react'

// Local files
import { PageHelmet } from '@/components/global/PageHelmet'
import { generateRecoveryKey } from '@/services/api'
import AuthLayout from '@/layouts/AuthLayout'
import './style.less'

const ForgotPassword: React.FunctionComponent = () => {
	const [requestOnGoing, setRequestOnGoing] = useState(false)
	const [form] = Form.useForm()

	const onSubmit = ({ email }: { email: string}) => {
		setRequestOnGoing(true)
		generateRecoveryKey(email).then(() => {
			message.success('Recovery mail sent successfully')
			form.resetFields()
			setRequestOnGoing(false)
		}).catch(({ response }) => {
			notification.error({
				message: 'Error',
				description: response.data.message,
				placement: 'topLeft'
			})
			setRequestOnGoing(false)
		})
	}

	const handleSubmitButtonView = () => (
		<Button style={{ width: '100%' }} size="large" type="primary" htmlType="submit">
			{requestOnGoing ? <LoadingOutlined /> : 'Send Recovery Mail'}
		</Button>
	)

	return (
		<AuthLayout>
			<PageHelmet
				title="Account Recovery | Feednext"
				description="Best reviews, comments, feedbacks about anything around the world"
				keywords="Forgot Password, Account Recovery, Can't Login"
				mediaImage="https://avatars1.githubusercontent.com/u/64217221?s=200&v=4"
				mediaDescription="Best reviews, comments, feedbacks about anything around the world"
			/>
			<div className={'main'}>
				<Form form={form} name="sign-in" onFinish={onSubmit} size="middle" scrollToFirstError>
					<Tabs>
						<Tabs.TabPane
							key="account-recovery"
							tab="Account Recovery"
						>
							<Form.Item
								name="email"
								rules={[
									{
										validator: (_, value) =>
										/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value) ? Promise.resolve() : Promise.reject('Email address is not valid'),
									},
								]}
							>
								<Input placeholder="Email Address" />
							</Form.Item>
							<Form.Item>
								{handleSubmitButtonView()}
							</Form.Item>
						</Tabs.TabPane>
					</Tabs>
				</Form>
			</div>
		</AuthLayout>
	)
}

export default ForgotPassword
