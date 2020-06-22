// Antd dependencies
import { Input, Row, Col, Checkbox, Button, Form, Divider, message } from 'antd'
import { UserOutlined, LockOutlined, LoadingOutlined } from '@ant-design/icons'

// Other dependencies
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import Link from 'next/link'

// Local files
import { signIn } from '@/services/api'
import { SET_ACCESS_TOKEN } from '@/redux/Actions/Global'
import { SIGN_IN } from '@/redux/Actions/User'

export declare interface FormDataType {
	usernameOrEmail: string
	password: string
	remember: boolean
}

export const LoginForm: React.FC = (): JSX.Element => {
	const [form] = Form.useForm()
	const [requestSending, setRequestSending] = useState(false)
	const dispatch = useDispatch()

	const onSubmit = (values: FormDataType): void => {
		const isEmail = /\S+@\S+\.\S+/.test(values.usernameOrEmail)
		setRequestSending(true)

		signIn({
			...(isEmail ? { email: values.usernameOrEmail } : { username: values.usernameOrEmail }),
			rememberMe: values.remember ? true : false,
			password: values.password,
		})
			.then(res => {
				dispatch({
					type: SET_ACCESS_TOKEN,
					token: res.data.attributes.access_token
				})
				delete res.data.attributes.access_token

				dispatch({
					type: SIGN_IN,
					user: res.data,
				})
				location.reload()
			})
			.catch(error => {
				setRequestSending(false)
				message.error(error.response.data.message, 5)
			})
	}

	return (
		<Form form={form} name="sign-in" onFinish={onSubmit} style={{ marginTop: 20 }}>
			<Form.Item
				style={{ margin: "0 0 10px 0" }}
				name="usernameOrEmail"
				rules={[{ required: true, message: "Enter an username or email" }]}
			>
				<Input prefix={<UserOutlined style={{ color: '#717171'}} />} placeholder="Username or Email" />
			</Form.Item>

			<Form.Item name="password" rules={[{ required: true, message: "Enter your password" }]}>
				<Input.Password prefix={<LockOutlined style={{ color: '#717171'}} />} placeholder="Password" />
			</Form.Item>

			<Row style={{ margin: "-5px 0 -10px 0" }}>
				<Col>
					<Form.Item name="remember" valuePropName="checked">
						<Checkbox>Remember me</Checkbox>
					</Form.Item>
				</Col>

				<Form.Item>
					<Link href="/auth/sign-in/forgot-password">
						<a style={{ float: "right", color: "#d60d17" }}>
							Forgot Password
						</a>
					</Link>
				</Form.Item>
			</Row>

			<Form.Item>
				<Button style={{ width: "100%" }} shape="round" htmlType="submit">
					{requestSending ? <LoadingOutlined /> : 'Sign In'}
				</Button>
			</Form.Item>

			<Divider style={{ margin: "0 0 -10px 0" }} orientation="right">
				<Link href="/auth/sign-up">Sign Up</Link>
			</Divider>
		</Form>
	)
}
