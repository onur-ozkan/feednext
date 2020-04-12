import React, { useState } from 'react'
import { Form, Input, Checkbox, Button, Tabs, message } from 'antd'
import styles from './style.less'
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale'
import { Link } from 'umi'
import { signUp } from '@/services/api'
import RegisterResult from './Result'

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
		<div className={styles.main}>
			<Form form={form} name="sign-up" onFinish={onSubmit} size="middle" scrollToFirstError>
				<Tabs>
					<Tabs.TabPane
						key="sign-up"
						tab={formatMessage({
							id: 'userandlogin.login.tab-login-signup',
						})}
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
								<FormattedMessage id="userandregister.register.register" />
							</Button>
							<Link className={styles.login} to="/auth/sign-in">
								<FormattedMessage id="userandregister.register.sign-in" />
							</Link>
						</Form.Item>
					</Tabs.TabPane>
				</Tabs>
			</Form>
		</div>
	)
}

export default Register
