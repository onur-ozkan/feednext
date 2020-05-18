// Antd dependencies
import { Form, Input, Checkbox, Button, Tabs, message } from 'antd'

// Other dependencies
import React, { useState } from 'react'
import { Link } from 'umi'

// Local files
import { signUp } from '@/services/api'
import { PageHelmet } from '@/components/PageHelmet'
import RegisterResult from './Result'
import styles from './style.less'

export declare interface FormDataType {
	fullName: string
	username: string
	email: string
	password: string
}

const Register = () => {
	const [form] = Form.useForm()
	const [signedAccount, setSignedAccount] = useState(null)

	const onSubmit = (values: FormDataType) => {
		signUp({
			fullName: values.fullName,
			username: values.username,
			email: values.email,
			password: values.password,
		})
			.then(res => {
				setSignedAccount(res.data.attributes)
			})
			.catch(error => {
				message.error(error.response.data.message, 3)
			})
	}

	if (signedAccount) {
		return <RegisterResult signedAccount={signedAccount} />
	}

	return (
		<>
			<PageHelmet
				title="Sign Up | Feednext"
				description="Best reviews, comments, feedbacks about anything around the world"
				keywords="sign up, register, create account, create user"
				mediaImage="https://avatars1.githubusercontent.com/u/64217221?s=200&v=4"
				mediaDescription="Best reviews, comments, feedbacks about anything around the world"
			/>
			<div className={styles.main}>
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
								<Input placeholder="Full Name" />
							</Form.Item>
							<Form.Item
								name="username"
								rules={[{ required: true, message: 'Please input your username!', whitespace: true }]}
							>
								<Input placeholder="Username" />
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
								<Input placeholder="Email" />
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
								<Input.Password placeholder="Password" />
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
								<Input.Password placeholder="Confirm Password" />
							</Form.Item>

							<Form.Item
								name="agreement"
								valuePropName="checked"
								rules={[
									{
										validator: (_, value) =>
											value ? Promise.resolve() : Promise.reject('Should accept agreement'),
									},
								]}
							>
								<Checkbox>
									I have read the <a href="">agreement</a>
								</Checkbox>
							</Form.Item>
							<Form.Item>
								<Button size="large" loading={false} className={styles.submit} type="primary" htmlType="submit">
									Register
								</Button>
								<Link className={styles.login} to="/auth/sign-in">
									Already have an Account?
								</Link>
							</Form.Item>
						</Tabs.TabPane>
					</Tabs>
				</Form>
			</div>
		</>
	)
}

export default Register
