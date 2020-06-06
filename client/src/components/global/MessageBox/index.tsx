// Antd dependencies
import { Badge } from 'antd'
import { InboxOutlined } from '@ant-design/icons'

// Other dependencies
import React from 'react'
import { useRouter } from 'next/router'

// Local files
import './style.less'

const MessageBox = ({ count }: { count: number }): JSX.Element => {
	const router = useRouter()

	const handleOnClick = () => router.push('/messages')
	return (
		<div className={'messageButton'}>
			<Badge
				count={count}
				style={{
					boxShadow: 'none',
				}}
				className={'badge'}
			>
				<InboxOutlined onClick={handleOnClick} className={'icon'} />
			</Badge>
		</div>
	)
}

export default MessageBox
