// Ant dependencies
import { Card, Tabs, Typography, Divider, Pagination, Empty, Row, Col, Button } from 'antd'
import { CopyOutlined, EditOutlined, LoadingOutlined, UpOutlined, DownOutlined } from '@ant-design/icons'

// Other dependencies
import React, { useState, useEffect } from 'react'
import { history } from 'umi'

// Local files
import { fetchAllFeeds, fetchAllEntriesByAuthor, fetchUserVotes } from '@/services/api'

export const UserTabs: React.FC<{username: string}> = (props) => {
	const [currentTab, setCurrentTab] = useState('feeds')
	const [totalItems, setTotalItems] = useState<number>(0)
	const [tabView, setTabView] = useState<JSX.Element>(
		<div style={{ textAlign: 'center' }}>
			<LoadingOutlined style={{ fontSize: 20 }} />
		</div>
	)

	useEffect(() => {
		setTabView(handleLoadingView)
		setTotalItems(0)
		switch (currentTab) {
			case 'feeds':
				handleFeedsTabView(0)
				break
			case 'entries':
				handleEntriesTabView(0)
				break
			case 'up-votes':
				handleVotesTabView('up', 0)
				break
			case 'down-votes':
				handleVotesTabView('down', 0)
				break
		}
	}, [currentTab])

	const handleLoadingView = (
		<div style={{
			minHeight: 460,
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center'
		}}>
			<LoadingOutlined style={{ fontSize: 20 }} />
		</div>
	)

	const handlePagination = (func: Function, voteType?: 'up' | 'down'): JSX.Element => (
		<Pagination
			size="small"
			showLessItems={true}
			showQuickJumper={false}
			defaultCurrent={1}
			pageSize={10}
			hideOnSinglePage
			total={totalItems}
			onChange={
				voteType ?
					(page: number): void => {
						setTabView(handleLoadingView)
						func(voteType, 10 * ( page -1))
					}
				:
					(page: number): void => {
						setTabView(handleLoadingView)
						func(10 * ( page -1))
					}
			}
		/>
	)

	const handleFeedsTabView = (skip: number): void => {
		fetchAllFeeds(skip, props.username, undefined, undefined).then(async res => {
			setTotalItems(res.data.attributes.count)

			if (res.data.attributes.titles.length === 0) {
				setTabView(
					<div style={{
						minHeight: 460,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center'
					}}>
						<Empty description="No Feed Found" image={Empty.PRESENTED_IMAGE_SIMPLE} />
					</div>
				)
				return
			}

			const feedList = await res.data.attributes.titles.map((title: any) =>
				<Row key={title.id} style={{ padding: 5 }}>
					<Col>
						{title.name}
					</Col>
					<Button onClick={(): void => history.push(`/${title.slug}`)} size="small" type="primary">
						Open
					</Button>
				</Row>
			)
			setTabView(
				<div style={{ minHeight: 460 }}>
					{feedList}
				</div>
			)
		})
	}

	const handleEntriesTabView = (skip: number): void => {
		fetchAllEntriesByAuthor(props.username, skip).then(async res => {
			setTotalItems(res.data.attributes.count)

			if (res.data.attributes.entries.length === 0) {
				setTabView(
					<div style={{
						minHeight: 460,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center'
					}}>
						<Empty description="No Entry Found" image={Empty.PRESENTED_IMAGE_SIMPLE} />
					</div>
				)
				return
			}

			const entryList = await res.data.attributes.entries.map((entry: any) =>
				<Row key={entry.id} style={{ padding: 5 }}>
					<Col>
						<Typography.Paragraph ellipsis>
							{entry.text}
						</Typography.Paragraph>
					</Col>
					<Button onClick={(): void => history.push(`/entry/${entry.id}`)} size="small" type="primary">
						Open
					</Button>
				</Row>
			)
			setTabView(
				<div style={{ minHeight: 460 }}>
					{entryList}
				</div>
			)
		})
	}

	const handleVotesTabView = (voteType: 'up' | 'down', skip: number): void => {
		fetchUserVotes(props.username, voteType, skip).then(async res => {
			setTotalItems(res.data.attributes.count)

			if (res.data.attributes.entries.length === 0) {
				setTabView(
					<div style={{
						minHeight: 460,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center'
					}}>
						<Empty
							description={`This user has not ${voteType} vote any entry yet`}
							image={Empty.PRESENTED_IMAGE_SIMPLE}
						/>
					</div>
				)
				return
			}

			const entryList = await res.data.attributes.entries.map((entry: any) =>
				<Row key={entry.id} style={{ padding: 5 }}>
					<Col>
						<Typography.Paragraph ellipsis>
							{entry.text}
						</Typography.Paragraph>
					</Col>
					<Button onClick={(): void => history.push(`/entry/${entry.id}`)} size="small" type="primary">
						Open
					</Button>
				</Row>
			)
			setTabView(
				<div style={{ minHeight: 460 }}>
					{entryList}
				</div>
			)
		})
	}

	const handleTabChange = (key: string): void => setCurrentTab(key)

	return (
		<Card bordered={false}>
			<Tabs size="small" animated={false} onChange={handleTabChange} defaultActiveKey={currentTab}>
				<Tabs.TabPane
					tab={
						<Typography.Text strong>
							<CopyOutlined style={{ marginRight: 0 }} /> Created Feeds
						</Typography.Text>
					}
					key="feeds"
				>
					{tabView}
					{totalItems > 0 &&
						<>
							<Divider />
							{handlePagination(handleFeedsTabView)}
						</>
					}
				</Tabs.TabPane>
				<Tabs.TabPane
					tab={
						<Typography.Text strong>
							<EditOutlined style={{ marginRight: 0 }} /> Created Entries
						</Typography.Text>
					}
					key="entries"
				>
					{tabView}
					{totalItems > 0 &&
						<>
							<Divider />
							{handlePagination(handleEntriesTabView)}
						</>
					}
				</Tabs.TabPane>
				<Tabs.TabPane
					tab={
						<Typography.Text strong>
							<UpOutlined style={{ marginRight: 0 }} /> Up Voted Entries
						</Typography.Text>
					}
					key="up-votes"
				>
					{tabView}
					{totalItems > 0 &&
						<>
							<Divider />
							{handlePagination(handleVotesTabView, 'up')}
						</>
					}
				</Tabs.TabPane>
				<Tabs.TabPane
					tab={
						<Typography.Text strong>
							<DownOutlined style={{ marginRight: 0 }} /> Down Voted Entries
						</Typography.Text>
					}
					key="down-votes"
				>
					{tabView}
					{totalItems > 0 &&
						<>
							<Divider />
							{handlePagination(handleVotesTabView, 'down')}
						</>
					}
				</Tabs.TabPane>
			</Tabs>
		</Card>
	)
}
