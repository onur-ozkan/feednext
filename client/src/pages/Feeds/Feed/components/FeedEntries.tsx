import React, { useState } from 'react'
import { Tooltip, List, Comment, Card } from 'antd'
import { LikeFilled, LikeOutlined, DislikeFilled, DislikeOutlined } from '@ant-design/icons'
import AddEntry from './AddEntry'

const FeedEntries: React.FC = () => {
	const [action, setAction] = useState(null)
	const [upVotes, setUpVotes] = useState(0)
	const [downVotes, setDownVotes] = useState(0)

	const paginationOptions = {
		size: 'small',
		showLessItems: true,
		showQuickJumper: true,
		pageSize: 10,
		total: 100,
	}

	const data = [
		{
			author: <span style={{ cursor: 'pointer' }}>@username</span>,
			avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
			content: (
				<p>
					We supply a series of design principles, practical patterns and high quality design resources (Sketch and
					Axure), to help people create their product prototypes beautifully and efficiently.
				</p>
			),
			datetime: (
				<Tooltip title={'2 hours ago'}>
					<span>2 hours ago</span>
				</Tooltip>
			),
		},
		{
			author: <span style={{ cursor: 'pointer' }}>@username</span>,
			avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
			content: (
				<p>
					We supply a series of design principles, practical patterns and high quality design resources (Sketch and
					Axure), to help people create their product prototypes beautifully and efficiently.
				</p>
			),
			datetime: (
				<Tooltip title={'15 min ago'}>
					<span>15 min ago</span>
				</Tooltip>
			),
		},
	]

	const actions = [
		<span key="comment-basic-like">
			<Tooltip title="Like">
				{React.createElement(action === 'upVoted' ? LikeFilled : LikeOutlined, {
					onClick: () => null,
				})}
			</Tooltip>
			<span className="comment-action"> {upVotes} </span>
		</span>,
		<span key=' key="comment-basic-dislike"'>
			<Tooltip title="Dislike">
				{React.createElement(action === 'upVoted' ? DislikeFilled : DislikeOutlined, {
					onClick: () => null,
				})}
			</Tooltip>
			<span className="comment-action"> {downVotes} </span>
		</span>,
	]

	return (
		<Card>
			<List
				pagination={paginationOptions}
				className="comment-list"
				header={`${data.length} Entries`}
				itemLayout="horizontal"
				dataSource={data}
				renderItem={item => (
					<li>
						<Comment
							actions={actions}
							author={item.author}
							avatar={item.avatar}
							content={item.content}
							datetime={item.datetime}
						/>
					</li>
				)}
			/>
			<AddEntry />
		</Card>
	)
}

export default FeedEntries
