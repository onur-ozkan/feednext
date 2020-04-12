import { Avatar, Menu, Spin } from 'antd'
import { FormattedMessage } from 'umi-plugin-react/locale'
import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import HeaderDropdown from '../HeaderDropdown'
import styles from './index.less'
import { UserOutlined, SettingOutlined, LogoutOutlined } from '@ant-design/icons'
import { SIGN_OUT } from '@/redux/Actions/User/types'

const AvatarDropdown = () => {

		const user = useSelector((state: any) => state.user)
		const dispatch = useDispatch()

		const handleSignOut = () => {
			dispatch({
				type: SIGN_OUT
			})
		}

		const menuHeaderDropdown = (
			<Menu className={styles.menu} selectedKeys={[]}>
				<Menu.Item key="/">
					<UserOutlined />
					<FormattedMessage id="menu.account" defaultMessage="account center" />
				</Menu.Item>

				<Menu.Item key="/settings">
					<SettingOutlined />
					<FormattedMessage id="menu.account.settings" defaultMessage="account settings" />
				</Menu.Item>

				<Menu.Item onClick={handleSignOut} key="/logout">
					<LogoutOutlined />
					<FormattedMessage id="menu.account.logout" defaultMessage="logout" />
				</Menu.Item>
			</Menu>
		)

		return user ? (
			<HeaderDropdown overlay={menuHeaderDropdown}>
				<span className={`${styles.action} ${styles.account}`}>
					<Avatar size="small" className={styles.avatar} alt="avatar" />
					<span className={styles.name}>{user.attributes.name}</span>
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
export default AvatarDropdown
