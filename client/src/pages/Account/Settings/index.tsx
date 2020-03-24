import React, { Component } from 'react'

import { Dispatch } from 'redux'
import { FormattedMessage } from 'umi-plugin-react/locale'
import { GridContent } from '@ant-design/pro-layout'
import { Menu } from 'antd'
import { connect } from 'dva'
import BaseView from './components/base'
import BindingView from './components/binding'
import { CurrentUser } from './data.d'
import NotificationView from './components/notification'
import SecurityView from './components/security'
import styles from './style.less'

const { Item } = Menu

declare interface SettingsProps {
	dispatch: Dispatch<any>
	currentUser: CurrentUser
}

type SettingsStateKeys = 'base' | 'security' | 'binding' | 'notification'
declare interface SettingsState {
	mode: 'inline' | 'horizontal'
	menuMap: {
		[key: string]: React.ReactNode
	}
	selectKey: SettingsStateKeys
}

class Settings extends Component<SettingsProps, SettingsState> {
	main: HTMLDivElement | undefined = undefined

	constructor(props: SettingsProps) {
		super(props)
		const menuMap = {
			base: <FormattedMessage id="accountandsettings.menuMap.basic" defaultMessage="Basic Settings" />,
			security: <FormattedMessage id="accountandsettings.menuMap.security" defaultMessage="Security Settings" />,
			binding: <FormattedMessage id="accountandsettings.menuMap.binding" defaultMessage="Account Binding" />,
			notification: (
				<FormattedMessage id="accountandsettings.menuMap.notification" defaultMessage="New Message Notification" />
			),
		}
		this.state = {
			mode: 'inline',
			menuMap,
			selectKey: 'base',
		}
	}

	componentDidMount(): void {
		const { dispatch } = this.props
		dispatch({
			type: 'accountAndSettings/fetchCurrent',
		})
		window.addEventListener('resize', this.resize)
		this.resize()
	}

	componentWillUnmount(): void {
		window.removeEventListener('resize', this.resize)
	}

	getMenu = (): object => {
		const { menuMap } = this.state
		return Object.keys(menuMap).map(item => <Item key={item}>{menuMap[item]}</Item>)
	}

	getRightTitle = (): React.ReactNode => {
		const { selectKey, menuMap } = this.state
		return menuMap[selectKey]
	}

	selectKey = (key: SettingsStateKeys): void => {
		this.setState({
			selectKey: key,
		})
	}

	resize = (): void => {
		if (!this.main) {
			return
		}
		requestAnimationFrame(() => {
			if (!this.main) {
				return
			}
			let mode: 'inline' | 'horizontal' = 'inline'
			const { offsetWidth } = this.main
			if (this.main.offsetWidth < 641 && offsetWidth > 400) {
				mode = 'horizontal'
			}
			if (window.innerWidth < 768 && offsetWidth > 400) {
				mode = 'horizontal'
			}
			this.setState({
				mode,
			})
		})
	}

	renderChildren = (): JSX.Element | null => {
		const { selectKey } = this.state
		switch (selectKey) {
			case 'base':
				return <BaseView />
			case 'security':
				return <SecurityView />
			case 'binding':
				return <BindingView />
			case 'notification':
				return <NotificationView />
			default:
				break
		}

		return null
	}

	render(): JSX.Element | string {
		const { currentUser } = this.props
		if (!currentUser.userid) {
			return ''
		}
		const { mode, selectKey } = this.state
		return (
			<GridContent>
				<div
					className={styles.main}
					ref={(ref): void => {
						if (ref) {
							this.main = ref
						}
					}}
				>
					<div className={styles.leftMenu}>
						<Menu
							mode={mode}
							selectedKeys={[selectKey]}
							onClick={({ key }): void => this.selectKey(key as SettingsStateKeys)}
						>
							{this.getMenu()}
						</Menu>
					</div>
					<div className={styles.right}>
						<div className={styles.title}>{this.getRightTitle()}</div>
						{this.renderChildren()}
					</div>
				</div>
			</GridContent>
		)
	}
}

export default connect(({ accountAndSettings }: { accountAndSettings: { currentUser: CurrentUser } }) => ({
	currentUser: accountAndSettings.currentUser,
}))(Settings)
