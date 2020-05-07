import { InboxOutlined } from '@ant-design/icons'

import { Badge } from 'antd'
import React from 'react'
import styles from './index.less'
import { router } from 'umi'

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
