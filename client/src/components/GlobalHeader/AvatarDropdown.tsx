import { Avatar, Menu } from 'antd'
import { FormattedMessage } from 'umi-plugin-react/locale'
import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import HeaderDropdown from '../HeaderDropdown'
import styles from './index.less'
import { UserOutlined, SettingOutlined, LogoutOutlined } from '@ant-design/icons'
import { router } from 'umi'
import { API_URL } from '../../../config/constants'
import { persistor } from '@/redux/store'

const AvatarDropdown = () => {
	const user = useSelector((state: any) => state.user?.attributes.user)

	const handleSignOut = async (): Promise<void> => {
		await persistor.purge()
		location.reload()
	}

	const menuHeaderDropdown = (
		<Menu className={styles.menu} selectedKeys={[]}>
			<Menu.Item onClick={(): void => router.push(`/user/${user.username}`)} key="/">
				<UserOutlined />
				Profile
			</Menu.Item>

			<Menu.Item onClick={(): void => router.push('/settings')} key="/settings">
				<SettingOutlined />
				Settings
			</Menu.Item>

			<Menu.Item onClick={handleSignOut} key="/logout">
				<LogoutOutlined />
				Sign Out
			</Menu.Item>
		</Menu>
	)

	return (
		<HeaderDropdown overlay={menuHeaderDropdown}>
			<span className={`${styles.action} ${styles.account}`}>
				<Avatar size="small" className={styles.avatar} src={`${API_URL}/v1/user/pp?username=${user.username}`} />
				<span className={styles.name}>{user.full_name.split(' ')[0]}</span>
			</span>
		</HeaderDropdown>
	)
}
export default AvatarDropdown
