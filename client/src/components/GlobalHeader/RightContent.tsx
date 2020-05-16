// Antd dependencies
import { Tag, Button } from 'antd'
import { PlusCircleOutlined, LoginOutlined } from '@ant-design/icons'

// Other dependencies
import React from 'react'
import { useSelector } from 'react-redux'
import { history } from 'umi'

// Local files
import Avatar from './AvatarDropdown'
import HeaderSearch from '../HeaderSearch'
import MessageBox from '../MessageBox'
import styles from './index.less'

export type SiderTheme = 'light' | 'dark'
export declare interface GlobalHeaderRightProps {
	theme?: SiderTheme
	layout: 'sidemenu' | 'topmenu'
}

const ENVTagColor = {
	dev: 'orange',
	test: 'green',
	pre: '#87d068',
}

const GlobalHeaderRight: React.SFC<GlobalHeaderRightProps> = props => {
	const user = useSelector((state: any) => state.user)
	const globalState = useSelector((state: any) => state.global)

	const { theme, layout } = props
	let className = styles.right

	if (theme === 'dark' && layout === 'topmenu') {
		className = `${styles.right}  ${styles.dark}`
	}

	const handleAuthorizedElements = (): JSX.Element => {
		if (user) {
			return (
				<>
					<Button
						onClick={(): void => history.push('/feeds/create-feed')}
						type="primary"
						shape="round"
						icon={<PlusCircleOutlined />}
					>
						New Feed
					</Button>
					<MessageBox count={globalState.unreadMessageInfo.total_unread_value} />
					<Avatar />
				</>
			)
		}

		return (
			<Button onClick={(): void => history.push('/auth/sign-in')} type="primary" shape="round" icon={<LoginOutlined />}>
				Sign In
			</Button>
		)
	}

	return (
		<div className={className}>
			<HeaderSearch />
			{handleAuthorizedElements()}
		</div>
	)
}

export default GlobalHeaderRight
