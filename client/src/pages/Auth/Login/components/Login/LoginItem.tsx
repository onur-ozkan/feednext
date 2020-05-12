// Antd dependencies
import { Button, Col, Input, Row } from 'antd'
import { Form } from '@ant-design/compatible'
import { FormComponentProps } from '@ant-design/compatible/es/form'

// Other dependencies
import React, { Component } from 'react'
import omit from 'omit.js'

// Local files
import LoginContext, { LoginContextProps } from './LoginContext'
import ItemMap from './map'
import styles from './index.less'
import '@ant-design/compatible/assets/index.css'

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

export type WrappedLoginItemProps = Omit<LoginItemProps, 'form' | 'type' | 'updateActive'>
export type LoginItemKeyType = keyof typeof ItemMap
export declare interface LoginItemType {
	UserName: React.FC<WrappedLoginItemProps>
	Password: React.FC<WrappedLoginItemProps>
	Mobile: React.FC<WrappedLoginItemProps>
	Captcha: React.FC<WrappedLoginItemProps>
}

export declare interface LoginItemProps {
	name?: string
	rules?: any[]
	style?: React.CSSProperties
	onGetCaptcha?: (event?: MouseEvent) => void | Promise<any> | false
	placeholder?: string
	buttonText?: React.ReactNode
	onPressEnter?: (e: any) => void
	countDown?: number
	getCaptchaButtonText?: string
	getCaptchaSecondText?: string
	updateActive?: LoginContextProps['updateActive']
	type?: string
	defaultValue?: string
	form?: FormComponentProps['form']
	customProps?: {
		[key: string]: any
	}
	onChange?: (e: any) => void
	tabUtil?: any
}

declare interface LoginItemState {
	count: number
}

const FormItem = Form.Item

class WrapFormItem extends Component<LoginItemProps, LoginItemState> {
	static defaultProps = {
		getCaptchaButtonText: 'captcha',
		getCaptchaSecondText: 'second',
	}

	interval: number | undefined = undefined

	constructor(props: LoginItemProps) {
		super(props)
		this.state = {
			count: 0,
		}
	}

	componentDidMount(): void {
		const { updateActive, name = '' } = this.props
		if (updateActive) {
			updateActive(name)
		}
	}

	componentWillUnmount(): void {
		clearInterval(this.interval)
	}

	onGetCaptcha = (): void => {
		const { onGetCaptcha } = this.props
		const result = onGetCaptcha ? onGetCaptcha() : null
		if (result === false) {
			return
		}
		if (result instanceof Promise) {
			result.then(this.runGetCaptchaCountDown)
		} else {
			this.runGetCaptchaCountDown()
		}
	}

	getFormItemOptions = ({
		onChange,
		defaultValue,
		customProps = {},
		rules,
	}: LoginItemProps): {
		rules?: any[] | undefined
		onChange?: ((e: any) => void) | undefined
		initialValue?: string | undefined
	} => {
		const options: {
			rules?: any[]
			onChange?: LoginItemProps['onChange']
			initialValue?: LoginItemProps['defaultValue']
		} = {
			rules: rules || customProps.rules,
		}
		if (onChange) {
			options.onChange = onChange
		}
		if (defaultValue) {
			options.initialValue = defaultValue
		}
		return options
	}

	runGetCaptchaCountDown = (): void => {
		const { countDown } = this.props
		let count = countDown || 59
		this.setState({
			count,
		})
		this.interval = window.setInterval(() => {
			count--
			this.setState({
				count,
			})
			if (count === 0) {
				clearInterval(this.interval)
			}
		}, 1000)
	}

	render(): JSX.Element | undefined {
		const { count } = this.state

		const {
			onChange,
			customProps,
			defaultValue,
			rules,
			name,
			getCaptchaButtonText,
			getCaptchaSecondText,
			updateActive,
			type,
			form,
			tabUtil,
			...restProps
		} = this.props
		if (!name) {
			return
		}
		if (!form) {
			return
		}
		const { getFieldDecorator } = form
		// get getFieldDecorator props
		const options = this.getFormItemOptions(this.props)
		const otherProps = restProps || {}

		if (type === 'Captcha') {
			const inputProps = omit(otherProps, ['onGetCaptcha', 'countDown'])

			return (
				<FormItem>
					<Row gutter={8}>
						<Col span={16}>{getFieldDecorator(name, options)(<Input {...customProps} {...inputProps} />)}</Col>
						<Col span={8}>
							<Button
								disabled={!!count}
								className={styles.getCaptcha}
								size="large"
								onClick={this.onGetCaptcha}
							>
								{count ? `${count} ${getCaptchaSecondText}` : getCaptchaButtonText}
							</Button>
						</Col>
					</Row>
				</FormItem>
			)
		}
		return <FormItem>{getFieldDecorator(name, options)(<Input {...customProps} {...otherProps} />)}</FormItem>
	}
}

const LoginItem: Partial<LoginItemType> = {}

Object.keys(ItemMap).forEach(key => {
	const item = ItemMap[key]
	LoginItem[key] = (props: LoginItemProps): JSX.Element => (
		<LoginContext.Consumer>
			{(context): JSX.Element => (
				<WrapFormItem
					customProps={item.props}
					rules={item.rules}
					{...props}
					type={key}
					{...context}
					updateActive={context.updateActive}
				/>
			)}
		</LoginContext.Consumer>
	)
})

export default LoginItem as LoginItemType
