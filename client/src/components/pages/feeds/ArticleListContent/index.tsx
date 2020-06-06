// Antd dependencies
import { Avatar, Typography } from 'antd'

// Other dependencies
import React from 'react'
import { useRouter } from 'next/router'
import { format, parseISO } from 'date-fns'

// Local files
import './index.less'

declare interface ArticleListContentProps {
	data: any
}

const ArticleListContent: React.FC<ArticleListContentProps> = ({
	data: { text, createdAt, avatar, writtenBy },
}) => {
	const router = useRouter()

	return (
		<div className={'listContent'}>
			<div className={'description'}>
				<Typography.Paragraph ellipsis>
					{text}
				</Typography.Paragraph>
			</div>
			<div className={'extra'}>
				<Avatar src={avatar} size="small" />
				<a style={{ zIndex: 10 }} onClick={() => router.push(`/user/${writtenBy}`, `/user/${writtenBy}`)}>
					{writtenBy}
				</a> posted at  {format(parseISO(createdAt), 'dd LLL yyyy (p O)')}
			</div>
		</div>
	)
}

export default ArticleListContent
