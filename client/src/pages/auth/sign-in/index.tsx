// Antd dependencies
import { Checkbox, message, Form, Input, Tabs, Button, Row, Col } from 'antd'
import { UserOutlined, LockOutlined, LoadingOutlined } from '@ant-design/icons'

// Other dependencies
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useRouter } from 'next/router'
import Link from 'next/link'

// Local files
import { SIGN_IN } from '@/redux/Actions/User'
import { SET_ACCESS_TOKEN } from '@/redux/Actions/Global'
import { PageHelmet } from '@/components/global/PageHelmet'
import { signIn } from '@/services/api'
import { withTranslation } from '@/../i18n'
import AuthLayout from '@/layouts/AuthLayout'
import './style.less'

export declare interface FormDataType {
	usernameOrEmail: string
	password: string
	remember: boolean
}

const Login: React.FunctionComponent = ({ t }) => {
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
							tab={t("loginPage:title")}
						>
							<Form.Item
								name="usernameOrEmail"
								rules={[{ required: true, message: t("loginPage:validationErrorEmailOrUsername") }]}
							>
								<Input prefix={<UserOutlined style={{ color: '#717171'}} />} placeholder={t("loginPage:usernameOrEmail")} />
							</Form.Item>

							<Form.Item name="password" rules={[{ required: true, message: t("loginPage:validationErrorPassword") }]}>
								<Input.Password prefix={<LockOutlined style={{ color: '#717171'}} />} placeholder={t("loginPage:password")} />
							</Form.Item>

							<Row>
								<Col span={12}>
									<Form.Item name="remember" valuePropName="checked">
										<Checkbox>{t("loginPage:rememberMe")}</Checkbox>
									</Form.Item>
								</Col>
								<Col span={12}>
									<Form.Item style={{ float: 'right'}}>
										<Link href="/auth/sign-in/forgot-password">
											<a style={{ color: '#d60d17' }}>
												{t("loginPage:forgotPassword")}
											</a>
										</Link>
									</Form.Item>
								</Col>
							</Row>

							<Form.Item>
								<Button className={'submit'} size="large" type="primary" htmlType="submit">
									{isSigning ? <LoadingOutlined /> : t("loginPage:signIn") }
								</Button>
								<Link href="/auth/sign-up">
									<a className={'register'}>
										{t("loginPage:createAccount")}
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

export default withTranslation('loginPage')(Login)
