// Antd dependencies
import { Form, Input, Checkbox, Button, Tabs, message } from 'antd'
import { LoadingOutlined, IdcardOutlined, UserOutlined, MailOutlined, LockOutlined } from '@ant-design/icons'

// Other dependencies
import React, { useState } from 'react'
import Link from 'next/link'

// Local files
import { signUp } from '@/services/api'
import { PageHelmet } from '@/components/global/PageHelmet'
import RegisterResult from '@/components/pages/sign-up/result'
import { Aggrements } from '@/components/global/Aggrements'
import AuthLayout from '@/layouts/AuthLayout'
import './style.less'

export declare interface FormDataType {
	fullName: string
	username: string
	email: string
	password: string
}

const Register = () => {
	const [requestOnGoing, setRequestOnGoing] = useState(false)
	const [signedAccount, setSignedAccount] = useState<FormDataType | null>(null)
	const [aggrementModalVisibility, setAggrementModalVisibilit] = useState<null | 'policy' | 'terms'>(null)
	const [form] = Form.useForm()

	const onSubmit = async (values: FormDataType) => {
		setRequestOnGoing(true)
		await signUp({
			fullName: values.fullName,
			username: values.username,
			email: values.email,
			password: values.password,
		})
			.then(res => {
				setSignedAccount(values)
			})
			.catch(error => {
				setRequestOnGoing(false)
				message.error(error.response.data.message, 3)
			})
	}

	const handleSubmitButtonView = () => (
		<Button size="large" loading={false} className={'submit'} type="primary" htmlType="submit">
			{requestOnGoing ? <LoadingOutlined /> : 'Sign Up'}
		</Button>
	)

	if (signedAccount) {
		return <RegisterResult signedAccount={signedAccount} />
	}

	return (
		<AuthLayout>
			<PageHelmet
				title="Sign Up | Feednext"
				description="Best reviews, comments, feedbacks about anything around the world"
				keywords="sign up, register, create account, create user"
				mediaImage="https://avatars1.githubusercontent.com/u/64217221?s=200&v=4"
				mediaDescription="Best reviews, comments, feedbacks about anything around the world"
			/>
			<div className={'main'}>
				<Aggrements
					aggrementModalVisibility={aggrementModalVisibility}
					closeAggrementWindow={(): void => setAggrementModalVisibilit(null)}
				/>
				<Form form={form} name="sign-up" onFinish={onSubmit} size="middle" scrollToFirstError>
					<Tabs>
						<Tabs.TabPane
							key="sign-up"
							tab="Sign Up"
						>
							<Form.Item
								name="fullName"
								rules={[{ required: true, message: 'Please input your name and surname!', whitespace: true }]}
							>
								<Input prefix={<IdcardOutlined style={{ color: '#717171'}} />} placeholder="Full Name" />
							</Form.Item>
							<Form.Item
								name="username"
								rules={[{ required: true, message: 'Please input your username!', whitespace: true }]}
							>
								<Input prefix={<UserOutlined style={{ color: '#717171'}} />} placeholder="Username" />
							</Form.Item>
							<Form.Item
								name="email"
								rules={[
									{
										type: 'email',
										message: 'The input is not valid E-mail!',
									},
									{
										required: true,
										message: 'Please input your E-mail!',
									},
								]}
							>
								<Input prefix={<MailOutlined style={{ color: '#717171'}} />} placeholder="Email" />
							</Form.Item>

							<Form.Item
								name="password"
								rules={[
									{
										required: true,
										message: 'Please input your password!',
									},
								]}
								hasFeedback
							>
								<Input.Password prefix={<LockOutlined style={{ color: '#717171'}} />} placeholder="Password" />
							</Form.Item>

							<Form.Item
								name="confirm"
								dependencies={['password']}
								hasFeedback
								rules={[
									{
										required: true,
										message: 'Please confirm your password!',
									},
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
								<Input.Password prefix={<LockOutlined style={{ color: '#717171'}} />} placeholder="Confirm Password" />
							</Form.Item>

							<Form.Item
								name="agreement"
								valuePropName="checked"
								rules={[
									{
										validator: (_, value) =>
											value ? Promise.resolve() : Promise.reject('You must accept the privacy policy and terms & conditions'),
									},
								]}
							>
								<Checkbox>
									I have read the
									{' '}
									<Button
										onClick={(): void => setAggrementModalVisibilit('policy')}
										type="link"
										style={{ margin: 0, padding: 0 }}
									>
										privacy policy
									</Button>
									{' '}
									and
									{' '}
									<Button
										onClick={(): void => setAggrementModalVisibilit('terms')}
										type="link"
										style={{ margin: 0, padding: 0 }}
									>
										terms & conditions
									</Button>
								</Checkbox>
							</Form.Item>
							<Form.Item>
								{handleSubmitButtonView()}
								<Link href="/auth/sign-in">
									<a className={'login'}>
										Already have an Account?
									</a>
								</Link>
							</Form.Item>
						</Tabs.TabPane>
					</Tabs>
				</Form>
			</div>
		</AuthLayout>
	)
}

export default Register
