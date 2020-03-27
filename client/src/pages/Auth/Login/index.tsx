import { Checkbox, message } from 'antd'
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale'
import React, { useState, useEffect } from 'react'

import { CheckboxChangeEvent } from 'antd/es/checkbox'
import { FormComponentProps } from '@ant-design/compatible/es/form'
import Link from 'umi/link'
import { useDispatch, useSelector } from 'react-redux'
import LoginComponents from './components/Login'
import styles from './style.less'
import api from '@/utils/api.ts'
import { StartUserActions } from '@/redux/Actions/User'

const { Tab, UserName, Password, Submit } = LoginComponents

export declare interface FormDataType {
	usernameOrEmail: string
	password: string
}

const Login: React.FunctionComponent = () => {
	let loginForm: FormComponentProps['form'] | undefined | null = undefined

	const [autoLogin, setAutoLogin] = useState(true)
	const user = useSelector((state: any) => state.user)
	const dispatch = useDispatch()

	useEffect(() => {
		if (user) console.log(user)
	}, [user])

	const changeAutoLogin = (e: CheckboxChangeEvent): void => {
		setAutoLogin(e.target.checked)
	}

	const handleSignIn = (err: any, values: FormDataType): void => {
		if (err) return
		const isEmail = /\S+@\S+\.\S+/.test(values.usernameOrEmail)

		api.signIn({
			...(isEmail ? { email: values.usernameOrEmail } : { username: values.usernameOrEmail }),
			password: values.password,
		})
			.then(res => {
				dispatch(StartUserActions.SignIn({ userInformation: res.data.data }))
			})
			.catch(error => {
				message.error(error.response.data.message, 5)
			})
	}

	return (
		<div className={styles.main}>
			<LoginComponents
				defaultActiveKey="sign-in"
				onSubmit={handleSignIn}
				ref={(form: any): void => {
					loginForm = form
				}}
			>
				<Tab
					key="sign-in"
					tab={formatMessage({
						id: 'userandlogin.login.tab-login-signin',
					})}
				>
					<UserName
						name="usernameOrEmail"
						placeholder={`${formatMessage({
							id: 'userandlogin.login.userName',
						})}: admin or user`}
						rules={[
							{
								required: true,
								message: formatMessage({
									id: 'userandlogin.userName.required',
								}),
							},
						]}
					/>
					<Password
						name="password"
						placeholder={`${formatMessage({
							id: 'userandlogin.login.password',
						})}: ant.design`}
						rules={[
							{
								required: true,
								message: formatMessage({
									id: 'userandlogin.password.required',
								}),
							},
						]}
						onPressEnter={(e): void => {
							e.preventDefault()
							if (loginForm) {
								loginForm.validateFields(handleSignIn)
							}
						}}
					/>
				</Tab>
				<div>
					<Checkbox checked={autoLogin} onChange={changeAutoLogin}>
						<FormattedMessage id="userandlogin.login.remember-me" />
					</Checkbox>
					<a
						style={{
							float: 'right',
						}}
						href=""
					>
						<FormattedMessage id="userandlogin.login.forgot-password" />
					</a>
				</div>
				<Submit>
					<FormattedMessage id="userandlogin.login.signin" />
				</Submit>
				<div className={styles.other}>
					<Link className={styles.register} to="/auth/sign-up">
						<FormattedMessage id="userandlogin.login.signup" />
					</Link>
				</div>
			</LoginComponents>
		</div>
	)
}

export default Login
