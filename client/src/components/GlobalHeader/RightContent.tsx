import { Tag, Button } from 'antd'
import React from 'react'
import { PlusCircleOutlined, LoginOutlined } from '@ant-design/icons'

import Avatar from './AvatarDropdown'
import HeaderSearch from '../HeaderSearch'
import styles from './index.less'
import { router } from 'umi'
import { useSelector } from 'react-redux'
import MessageBox from '../MessageBox'

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
	const { theme, layout } = props
	let className = styles.right
	const user = useSelector((state: any) => state.user)

	if (theme === 'dark' && layout === 'topmenu') {
		className = `${styles.right}  ${styles.dark}`
	}

	const handleAuthorizedElements = (): JSX.Element => {
		if (user) {
			return (
				<>
					<Button
						onClick={(): void => router.push('/feeds/create-feed')}
						type="primary"
						shape="round"
						icon={<PlusCircleOutlined />}
					>
						New Feed
					</Button>
					<MessageBox count={0} />
					<Avatar />
				</>
			)
		}

		return (
			<Button onClick={(): void => router.push('/auth/sign-in')} type="primary" shape="round" icon={<LoginOutlined />}>
				Sign In
			</Button>
		)
	}

	return (
		<div className={className}>
			<HeaderSearch />
			{handleAuthorizedElements()}
			{REACT_APP_ENV && <Tag color={ENVTagColor[REACT_APP_ENV]}>{REACT_APP_ENV}</Tag>}
		</div>
	)
}

export default GlobalHeaderRight
