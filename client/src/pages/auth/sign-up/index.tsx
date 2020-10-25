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
import { withTranslation } from '@/../i18n'
import AuthLayout from '@/layouts/AuthLayout'
import './style.less'

export declare interface FormDataType {
	fullName: string
	username: string
	email: string
	password: string
}

const Register: React.FunctionComponent = ({ t }) => {
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
			{requestOnGoing ? <LoadingOutlined /> : t("registerPage:signUp")}
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
							tab={t("registerPage:title")}
						>
							<Form.Item
								name="fullName"
								rules={[{ required: true, message: t("registerPage:validationErrorFullName"), whitespace: true }]}
							>
								<Input prefix={<IdcardOutlined style={{ color: '#717171'}} />} placeholder={t("registerPage:fullName")} />
							</Form.Item>
							<Form.Item
								name="username"
								rules={[{ required: true, message: t("registerPage:validationErrorUsername"), whitespace: true }]}
							>
								<Input prefix={<UserOutlined style={{ color: '#717171'}} />} placeholder={t("registerPage:username")} />
							</Form.Item>
							<Form.Item
								name="email"
								rules={[
									{
										type: 'email',
										message: t("registerPage:validationErrorEmail2"),
									},
									{
										required: true,
										message: t("registerPage:validationErrorEmail"),
									},
								]}
							>
								<Input prefix={<MailOutlined style={{ color: '#717171'}} />} placeholder={t("registerPage:email")} />
							</Form.Item>

							<Form.Item
								name="password"
								rules={[
									{
										required: true,
										message: t("registerPage:validationErrorPassword"),
									},
								]}
								hasFeedback
							>
								<Input.Password prefix={<LockOutlined style={{ color: '#717171'}} />} placeholder={t("registerPage:password")} />
							</Form.Item>

							<Form.Item
								name="confirm"
								dependencies={['password']}
								hasFeedback
								rules={[
									{
										required: true,
										message: t("registerPage:validationErrorConfirmPassword"),
									},
									({ getFieldValue }) => ({
										validator(rule, value) {
											if (!value || getFieldValue('password') === value) {
												return Promise.resolve()
											}
											return Promise.reject(t("registerPage:validationErrorPasswordMatch"))
										},
									}),
								]}
							>
								<Input.Password prefix={<LockOutlined style={{ color: '#717171'}} />} placeholder={t("registerPage:confirmPassword")} />
							</Form.Item>

							<Form.Item
								name="agreement"
								valuePropName="checked"
								rules={[
									{
										validator: (_, value) =>
											value ? Promise.resolve() : Promise.reject(t("registerPage:validationErrorTermsAndPolicy")),
									},
								]}
							>
								<Checkbox>
									<Button
										onClick={(): void => setAggrementModalVisibilit('policy')}
										type="link"
										style={{ margin: 0, padding: 0 }}
									>
										{t("registerPage:privacyPolicy")}
									</Button>
									{' '}
									,
									{' '}
									<Button
										onClick={(): void => setAggrementModalVisibilit('terms')}
										type="link"
										style={{ margin: 0, padding: 0 }}
									>
										{t("registerPage:termsAndConditions")}
									</Button>
									{' '}
									{t("registerPage:readAndUnderstood")}
								</Checkbox>
							</Form.Item>
							<Form.Item>
								{handleSubmitButtonView()}
								<Link href="/auth/sign-in">
									<a className={'login'}>
										{t("registerPage:alreadyHaveAnAccount")}
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

export default withTranslation('registerPage')(Register)
