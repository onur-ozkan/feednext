import { Avatar, Menu, Spin } from 'antd'
import { ClickParam } from 'antd/es/menu'
import { FormattedMessage } from 'umi-plugin-react/locale'
import React from 'react'
import { connect } from 'dva'
import { router } from 'umi'

import { ConnectProps, ConnectState } from '@/models/connect'
import { CurrentUser } from '@/models/user'
import HeaderDropdown from '../HeaderDropdown'
import styles from './index.less'
import { UserOutlined, SettingOutlined, LogoutOutlined } from '@ant-design/icons'

export declare interface GlobalHeaderRightProps extends ConnectProps {
	currentUser?: CurrentUser
}

class AvatarDropdown extends React.Component<GlobalHeaderRightProps> {
	onMenuClick = (event: ClickParam): void => {
		const { key } = event

		if (key === '/logout') {
			const { dispatch } = this.props
			if (dispatch) {
				dispatch({
					type: 'login/logout',
				})
			}

			return
		}
		router.push(`/account${key}`)
	}

	render(): React.ReactNode {
		const {
			currentUser = {
				avatar: '',
				name: '',
			},
		} = this.props

		const menuHeaderDropdown = (
			<Menu className={styles.menu} selectedKeys={[]} onClick={this.onMenuClick}>
				<Menu.Item key="/">
					<UserOutlined />
					<FormattedMessage id="menu.account" defaultMessage="account center" />
				</Menu.Item>

				<Menu.Item key="/settings">
					<SettingOutlined />
					<FormattedMessage id="menu.account.settings" defaultMessage="account settings" />
				</Menu.Item>

				<Menu.Item key="/logout">
					<LogoutOutlined />
					<FormattedMessage id="menu.account.logout" defaultMessage="logout" />
				</Menu.Item>
			</Menu>
		)

		return currentUser && currentUser.name ? (
			<HeaderDropdown overlay={menuHeaderDropdown}>
				<span className={`${styles.action} ${styles.account}`}>
					<Avatar size="small" className={styles.avatar} src={currentUser.avatar} alt="avatar" />
					<span className={styles.name}>{currentUser.name}</span>
				</span>
			</HeaderDropdown>
		) : (
			<Spin
				size="small"
				style={{
					marginLeft: 8,
					marginRight: 8,
				}}
			/>
		)
	}
}
export default AvatarDropdown
