// Antd dependencies
import { Avatar, Menu } from 'antd'
import { UserOutlined, SettingOutlined, LogoutOutlined } from '@ant-design/icons'

// Other dependencies
import React from 'react'
import { useSelector } from 'react-redux'
import { router } from 'umi'

// Local files
import { persistor } from '@/redux/store'
import { API_URL } from '@/../config/constants'
import HeaderDropdown from '../HeaderDropdown'
import styles from './index.less'


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
		<HeaderDropdown trigger={['click']} overlay={menuHeaderDropdown}>
			<span className={`${styles.action} ${styles.account}`}>
				<Avatar size="small" className={styles.avatar} src={`${API_URL}/v1/user/pp?username=${user.username}`} />
				<span className={styles.name}>{user.full_name.split(' ')[0]}</span>
			</span>
		</HeaderDropdown>
	)
}
export default AvatarDropdown
