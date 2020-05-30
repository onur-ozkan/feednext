// Antd dependencies
import { Avatar, Typography } from 'antd'

// Other dependencies
import React from 'react'
import { history } from 'umi'
import { format, parseISO } from 'date-fns'

// Local files
import styles from './index.less'

declare interface ArticleListContentProps {
	data: any
}

const ArticleListContent: React.FC<ArticleListContentProps> = ({
	data: { text, createdAt, avatar, writtenBy },
}) => (
	<div className={styles.listContent}>
		<div className={styles.description}>
			<Typography.Paragraph ellipsis>
				{text}
			</Typography.Paragraph>
		</div>
		<div className={styles.extra}>
			<Avatar src={avatar} size="small" />
			<a style={{ zIndex: 10 }} onClick={(): void => history.push(`/user/${writtenBy}`)}>
				{writtenBy}
			</a> posted at  {format(parseISO(createdAt), 'dd LLL (p O)')}
		</div>
	</div>
)

export default ArticleListContent
