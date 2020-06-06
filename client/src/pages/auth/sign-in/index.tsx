// Antd dependencies
import { Checkbox, message, Form, Input, Tabs, Button, Row, Col } from 'antd'
import { UserOutlined, LockOutlined, LoadingOutlined } from '@ant-design/icons'

// Other dependencies
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/router'

// Local files
import { SIGN_IN } from '@/redux/Actions/User'
import { SET_ACCESS_TOKEN } from '@/redux/Actions/Global'
import { PageHelmet } from '@/components/global/PageHelmet'
import { signIn } from '@/services/api'
import AuthLayout from '@/layouts/AuthLayout'
import '@/styles/pages/auth/sign-in/style.less'

export declare interface FormDataType {
	usernameOrEmail: string
	password: string
	remember: boolean
}

const Login: React.FunctionComponent = () => {
	const router = useRouter()

	const [form] = Form.useForm()
	const dispatch = useDispatch()

	const [isSigning, setIsSigning] = useState(false)

	const onSubmit = (values: FormDataType): void => {
		const isEmail = /\S+@\S+\.\S+/.test(values.usernameOrEmail)
		setIsSigning(true)

		signIn({
			...(isEmail ? { email: values.usernameOrEmail } : { username: values.usernameOrEmail }),
			rememberMe: values.remember ? true : false,
			password: values.password,
		})
			.then(async res => {
				await dispatch({
					type: SET_ACCESS_TOKEN,
					token: res.data.attributes.access_token
				})
				delete res.data.attributes.access_token

				await dispatch({
					type: SIGN_IN,
					user: res.data,
				})

				router.push('/')
			})
			.catch(error => {
				setIsSigning(false)
				message.error(error.response.data.message, 5)
			})
	}

	return (
		<AuthLayout>
			<PageHelmet
				title="Sign In | Feednext"
				description="Best reviews, comments, feedbacks about anything around the world"
				keywords="sign in, login"
				mediaImage="https://avatars1.githubusercontent.com/u/64217221?s=200&v=4"
				mediaDescription="Best reviews, comments, feedbacks about anything around the world"
			/>
			<div className={'main'}>
				<Form form={form} name="sign-in" onFinish={onSubmit} size="middle" scrollToFirstError>
					<Tabs>
						<Tabs.TabPane
							key="sign-in"
							tab="Sign In"
						>
							<Form.Item
								name="usernameOrEmail"
								rules={[{ required: true, message: 'Please input your username or email!' }]}
							>
								<Input prefix={<UserOutlined style={{ color: '#717171'}} />} placeholder="Username or Email" />
							</Form.Item>

							<Form.Item name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
								<Input.Password prefix={<LockOutlined style={{ color: '#717171'}} />} placeholder="Password" />
							</Form.Item>

							<Row>
								<Col span={12}>
									<Form.Item name="remember" valuePropName="checked">
										<Checkbox>Remember me</Checkbox>
									</Form.Item>
								</Col>
								<Col span={12}>
									<Form.Item style={{ float: 'right'}}>
										<a style={{ color: '#d60d17' }} href="/auth/sign-in/forgot-password">
												Forgot Password
										</a>
									</Form.Item>
								</Col>
							</Row>

							<Form.Item>
								<Button className={'submit'} size="large" type="primary" htmlType="submit">
									{isSigning ? <LoadingOutlined /> : 'Sign In'}
								</Button>
								<a className={'register'} href="/auth/sign-up">
									Create an Account
								</a>
							</Form.Item>
						</Tabs.TabPane>
					</Tabs>
				</Form>
			</div>
		</AuthLayout>
	)
}

export default Login
