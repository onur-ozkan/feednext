// Antd dependencies
import { Button } from 'antd'
import { PlusCircleOutlined, LoginOutlined } from '@ant-design/icons'

// Other dependencies
import React from 'react'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/router'

// Local files
import Avatar from './AvatarDropdown'
import HeaderSearch from '../HeaderSearch'
import MessageBox from '../MessageBox'
import './style.less'

const GlobalHeaderRight: React.SFC = () => {
	const router = useRouter()
	const user = useSelector((state: any) => state.user)
	const globalState = useSelector((state: any) => state.global)

	const className = `right  dark`

	const handleAuthorizedElements = (): JSX.Element => {
		if (user) {
			return (
				<>
					<Button
						onClick={() => router.push('/create-feed')}
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
			<Button onClick={() => router.push('/auth/sign-in')} type="primary" shape="round" icon={<LoginOutlined />}>
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
