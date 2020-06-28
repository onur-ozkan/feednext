// Antd dependencies
import { Avatar, Typography } from 'antd'

// Other dependencies
import React from 'react'
import { format, parseISO } from 'date-fns'

// Local files
import './index.less'
import Link from 'next/link'

declare interface ArticleListContentProps {
	data: any
}

export const ArticleListContent: React.FC<ArticleListContentProps> = ({
	data: { text, createdAt, avatar, writtenBy },
}) => {
	return (
		<div className={'listContent'}>
			<div className={'description'}>
				<Typography.Paragraph ellipsis>
					{text}
				</Typography.Paragraph>
			</div>
			<div className={'extra'}>
				<Link href="/user/[username]" as={`/user/${writtenBy}`}>
					<a style={{ zIndex: 10 }}>
						<Avatar src={avatar} size="small" alt="Author Image" style={{ marginRight: 5, width: 20, height: 20 }} />
						{writtenBy}
					</a>
				</Link>
				{' '}posted at  {format(parseISO(createdAt), 'dd LLL yyyy (p O)')}
			</div>
		</div>
	)
}