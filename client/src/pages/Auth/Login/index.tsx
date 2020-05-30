// Antd dependencies
import { Checkbox, message, Form, Input, Tabs, Button, Row, Col } from 'antd'

// Other dependencies
import React from 'react'
import { useDispatch } from 'react-redux'
import { history, Link } from 'umi'

// Local files
import { SIGN_IN } from '@/redux/Actions/User'
import { SET_ACCESS_TOKEN } from '@/redux/Actions/Global'
import { PageHelmet } from '@/components/PageHelmet'
import { signIn } from '@/services/api'
import styles from './style.less'

export declare interface FormDataType {
	usernameOrEmail: string
	password: string
	remember: boolean
}

const Login: React.FunctionComponent = () => {
	const [form] = Form.useForm()
	const dispatch = useDispatch()

	const onSubmit = (values: FormDataType): void => {
		const isEmail = /\S+@\S+\.\S+/.test(values.usernameOrEmail)

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
				history.push('/')
			})
			.catch(error => {
				message.error(error.response.data.message, 5)
			})
	}

	return (
		<>
			<PageHelmet
				title="Sign In | Feednext"
				description="Best reviews, comments, feedbacks about anything around the world"
				keywords="sign in, login"
				mediaImage="https://avatars1.githubusercontent.com/u/64217221?s=200&v=4"
				mediaDescription="Best reviews, comments, feedbacks about anything around the world"
			/>
			<div className={styles.main}>
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
								<Input placeholder="Username or Email" />
							</Form.Item>

							<Form.Item name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
								<Input.Password placeholder="Password" />
							</Form.Item>

							<Row>
								<Col>
									<Form.Item name="remember" valuePropName="checked">
										<Checkbox>Remember me</Checkbox>
									</Form.Item>
								</Col>

								<Form.Item>
									<Link style={{ float: 'right', color: '#d60d17' }} to="/auth/sign-in/forgot-password">
											Forgot Password
									</Link>
								</Form.Item>
							</Row>

							<Form.Item>
								<Button className={styles.submit} size="large" type="primary" htmlType="submit">
									Login
								</Button>
								<Link className={styles.register} to="/auth/sign-up">
									Create an Account
								</Link>
							</Form.Item>
						</Tabs.TabPane>
					</Tabs>
				</Form>
			</div>
		</>
	)
}

export default Login
