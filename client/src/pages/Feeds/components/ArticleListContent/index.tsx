// Antd dependencies
import { Avatar } from 'antd'

// Other dependencies
import React from 'react'
import { router } from 'umi'
import { format, parseISO } from 'date-fns'

// Local files
import styles from './index.less'

declare interface ArticleListContentProps {
	data: any
}

const ArticleListContent: React.FC<ArticleListContentProps> = ({
	data: { text, createdAt, avatar, writtenBy, profileUrl },
}) => (
	<div className={styles.listContent}>
		<div className={styles.description}>{text}</div>
		<div className={styles.extra}>
			<Avatar src={avatar} size="small" />
			<a style={{ zIndex: 10 }} onClick={(): void => router.push(`/user/${writtenBy}`)}>
				{writtenBy}
			</a> posted at  {format(parseISO(createdAt), 'dd LLL (p O)')}
		</div>
	</div>
)

export default ArticleListContent
