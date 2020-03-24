import { Form } from '@ant-design/compatible'
import '@ant-design/compatible/assets/index.css'
import { Card, Table, Tag, Avatar, Radio, Progress } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import React, { Component } from 'react'

import { Dispatch } from 'redux'
import { FormComponentProps } from '@ant-design/compatible/es/form'
import { connect } from 'dva'
import { StateType } from './model'
import { BasicListItemDataType } from './data'
import Search from 'antd/lib/input/Search'

interface TopFeedersProps extends FormComponentProps {
	topFeeders: StateType
	dispatch: Dispatch<any>
	loading: boolean
}
interface TopFeedersState {
	visible: boolean
	done: boolean
	current?: Partial<BasicListItemDataType>
}

class TopFeeders extends Component<TopFeedersProps, TopFeedersState> {
	private columns = [
		{
			title: '',
			dataIndex: 'avatar',
			key: 'avatar',
			render: avatar => <Avatar icon={<UserOutlined />} />,
			fixed: true,
		},
		{
			title: 'Name',
			dataIndex: 'name',
			key: 'name',
			render: text => <a>{text}</a>,
			fixed: true,
		},
		{
			title: 'Feed Percentage',
			dataIndex: 'feedPercentage',
			key: 'feedPercentage',
			render: percentage => (
				<Progress
					percent={50}
					status="active"
					strokeWidth={4}
					style={{
						width: 150,
					}}
				/>
			),
			fixed: true,
		},
		{
			title: 'Job',
			dataIndex: 'job',
			key: 'job',
			render: job => <span> {job} </span>,
			fixed: true,
		},
		{
			title: 'Tags',
			key: 'tags',
			dataIndex: 'tags',
			render: tags => (
				<span>
					{tags.map(tag => {
						let color = tag.length > 5 ? 'geekblue' : 'green'
						if (tag === 'loser') {
							color = 'volcano'
						}
						return (
							<Tag color={color} key={tag}>
								{tag.toUpperCase()}
							</Tag>
						)
					})}
				</span>
			),
			fixed: true,
		},
	]

	private data = [
		{
			key: '1',
			name: 'John Brown',
			feedPercentage: 17,
			job: 'Engineer',
			tags: ['nice', 'developer'],
			fixed: true,
		},
		{
			key: '2',
			name: 'Jim Green',
			feedPercentage: 56,
			job: 'Researcher',
			tags: ['loser'],
			fixed: true,
		},
		{
			key: '3',
			name: 'Joe Black',
			feedPercentage: 84,
			job: 'Teacher',
			tags: ['cool', 'teacher'],
			fixed: true,
		},
	]

	render(): JSX.Element {
		return (
			<Card>
				<div style={{ float: 'right', paddingBottom: 25, position: 'relative', zIndex: 1, maxWidth: 315 }}>
					<Radio.Group defaultValue="weekly" style={{ marginBottom: 15 }}>
						<Radio.Button value="daily">Daily</Radio.Button>
						<Radio.Button value="weekly">Weekly</Radio.Button>
						<Radio.Button value="monthly">Monthly</Radio.Button>
						<Radio.Button value="all">All Times</Radio.Button>
					</Radio.Group>
					<br />
					<Search
						placeholder="Search by anything"
						enterButton
						onChange={({ target: { value } }) => console.log(value)}
					/>
				</div>
				<Table size="middle" dataSource={this.data} columns={this.columns} />
			</Card>
		)
	}
}

export default connect(
	({ topFeeders, loading }: { topFeeders: StateType; loading: { models: { [key: string]: boolean } } }) => ({
		topFeeders,
		loading: loading.models.topFeeders,
	}),
)(Form.create<TopFeedersProps>()(TopFeeders))
