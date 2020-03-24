import { Alert, Checkbox } from 'antd'
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale'
import React, { Component } from 'react'

import { CheckboxChangeEvent } from 'antd/es/checkbox'
import { Dispatch } from 'redux'
import { FormComponentProps } from '@ant-design/compatible/es/form'
import Link from 'umi/link'
import { connect } from 'dva'
import { StateType } from './model'
import LoginComponents from './components/Login'
import styles from './style.less'
import api from '@/utils/api.ts'

const { Tab, UserName, Password, Submit } = LoginComponents

declare interface LoginProps {
	dispatch: Dispatch<any>
	userAndlogin: StateType
	submitting: boolean
}
declare interface LoginState {
	type: string
	autoLogin: boolean
}
export declare interface FormDataType {
	username: string
	password: string
}

class Login extends Component<LoginProps, LoginState> {
	loginForm: FormComponentProps['form'] | undefined | null = undefined

	state: LoginState = {
		type: 'account',
		autoLogin: true,
	}

	changeAutoLogin = (e: CheckboxChangeEvent): void => {
		this.setState({
			autoLogin: e.target.checked,
		})
	}

	handleSubmit = (err: any, values: FormDataType): void => {
		api.signIn({
			email: values.username,
			password: values.password,
		})
			.then(value => console.log(value))
			.catch(err => console.log(err.response))
		const { type } = this.state
		if (!err) {
			const { dispatch } = this.props
			dispatch({
				type: 'userAndlogin/login',
				payload: {
					...values,
					type,
				},
			})
		}
	}

	onTabChange = (type: string): void => {
		this.setState({
			type,
		})
	}

	renderMessage = (content: string): JSX.Element => (
		<Alert
			style={{
				marginBottom: 24,
			}}
			message={content}
			type="error"
			showIcon
		/>
	)

	render(): JSX.Element {
		const { userAndlogin, submitting } = this.props
		const { status, type: loginType } = userAndlogin
		const { type, autoLogin } = this.state
		return (
			<div className={styles.main}>
				<LoginComponents
					defaultActiveKey={type}
					onTabChange={this.onTabChange}
					onSubmit={this.handleSubmit}
					ref={(form: any): void => {
						this.loginForm = form
					}}
				>
					<Tab
						key="account"
						tab={formatMessage({
							id: 'userandlogin.login.tab-login-signin',
						})}
					>
						{status === 'error' &&
							loginType === 'account' &&
							!submitting &&
							this.renderMessage(
								formatMessage({
									id: 'userandlogin.login.message-invalid-credentials',
								}),
							)}
						<UserName
							name="username"
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
								if (this.loginForm) {
									this.loginForm.validateFields(this.handleSubmit)
								}
							}}
						/>
					</Tab>
					<div>
						<Checkbox checked={autoLogin} onChange={this.changeAutoLogin}>
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
					<Submit loading={submitting}>
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
}

export default connect(
	({ userAndlogin, loading }: { userAndlogin: StateType; loading: { effects: { [key: string]: boolean } } }) => ({
		userAndlogin,
		submitting: loading.effects['userAndlogin/login'],
	}),
)(Login)
