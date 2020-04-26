import { Avatar, Menu } from 'antd'
import { FormattedMessage } from 'umi-plugin-react/locale'
import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import HeaderDropdown from '../HeaderDropdown'
import styles from './index.less'
import { UserOutlined, SettingOutlined, LogoutOutlined } from '@ant-design/icons'
import { SIGN_OUT } from '@/redux/Actions/User/types'
import { router } from 'umi'
import { API_URL } from '../../../config/constants'

const AvatarDropdown = () => {

		const user = useSelector((state: any) => state.user?.attributes.user)
		const dispatch = useDispatch()

		const handleSignOut = () => {
			dispatch({
				type: SIGN_OUT
			})
		}

		const menuHeaderDropdown = (
			<Menu className={styles.menu} selectedKeys={[]}>
				<Menu.Item onClick={(): void => router.push(`/user/${user.username}`)} key="/">
					<UserOutlined />
					<FormattedMessage id="menu.account" defaultMessage="account center" />
				</Menu.Item>

				<Menu.Item onClick={(): void => router.push('/settings')} key="/settings">
					<SettingOutlined />
					<FormattedMessage id="menu.account.settings" defaultMessage="account settings" />
				</Menu.Item>

				<Menu.Item onClick={handleSignOut} key="/logout">
					<LogoutOutlined />
					<FormattedMessage id="menu.account.logout" defaultMessage="logout" />
				</Menu.Item>
			</Menu>
		)

		return (
			<HeaderDropdown overlay={menuHeaderDropdown}>
				<span className={`${styles.action} ${styles.account}`}>
					<Avatar size="small" className={styles.avatar} src={`${API_URL}/v1/user/${user.username}/pp`} />
					<span className={styles.name}>{user.full_name.split(' ')[0]}</span>
				</span>
			</HeaderDropdown>
		)
}
export default AvatarDropdown
