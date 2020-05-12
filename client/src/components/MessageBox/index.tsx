// Antd dependencies
import { Badge } from 'antd'
import { InboxOutlined } from '@ant-design/icons'

// Other dependencies
import React from 'react'
import { router } from 'umi'

// Local files
import styles from './index.less'

const MessageBox = ({ count }: { count: number }): JSX.Element => {
	const handleOnClick = (): void => router.push('/messages')
	return (
		<div className={styles.messageButton}>
			<Badge
				count={count}
				style={{
					boxShadow: 'none',
				}}
				className={styles.badge}
			>
				<InboxOutlined onClick={handleOnClick} className={styles.icon} />
			</Badge>
		</div>
	)
}

export default MessageBox
