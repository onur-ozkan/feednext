// Ant dependencies
import { Card, Tabs, Typography, Divider, Pagination, Empty, Button, Row } from 'antd'
import { CopyOutlined, EditOutlined, LoadingOutlined, UpOutlined, DownOutlined, ArrowRightOutlined } from '@ant-design/icons'

// Other dependencies
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

// Local files
import { fetchAllFeeds, fetchAllEntriesByAuthor, fetchUserVotes } from '@/services/api'

export const UserTabs: React.FC<{username: string}> = (props) => {
	const router = useRouter()

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
				<Row style={{ alignItems: 'center' }}>
					<Typography.Text style={{ width: 'calc(100% - 30px)' }} ellipsis strong>
						{title.name}
					</Typography.Text>
					<Button
						onClick={() => router.push('/[feed]', `/${title.slug}`)}
						style={{ width: 25, marginLeft: 5 }}
						size="large"
						type="link"
						icon={<ArrowRightOutlined style={{ color: '#6ec49a' }} />}
					/>
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
				<Row style={{ alignItems: 'center' }}>
					<Typography.Text style={{ width: 'calc(100% - 30px)' }} ellipsis strong>
						{entry.text}
					</Typography.Text>
					<Button
						onClick={() => router.push('/entry/[id]', `/entry/${entry.id}`)}
						style={{ width: 25, marginLeft: 5 }}
						size="large"
						type="link"
						icon={<ArrowRightOutlined style={{ color: '#6ec49a' }} />}
					/>
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
				<Row style={{ alignItems: 'center' }}>
					<Typography.Text style={{ width: 'calc(100% - 30px)' }} ellipsis strong>
						{entry.text}
					</Typography.Text>
					<Button
						onClick={() => router.push('/entry/[id]', `/entry/${entry.id}`)}
						style={{ width: 25, marginLeft: 5 }}
						size="large"
						type="link"
						icon={<ArrowRightOutlined style={{ color: '#6ec49a' }} />}
					/>
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
		<Card className="blockEdges" bordered={false}>
			<Tabs size="small" animated={false} onChange={handleTabChange} defaultActiveKey={currentTab}>
				<Tabs.TabPane
					tab={
						<Typography.Text style={{ color: 'gray' }} strong>
							<CopyOutlined style={{ marginRight: 0 }} /> FEEDS
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
						<Typography.Text style={{ color: 'gray' }} strong>
							<EditOutlined style={{ marginRight: 0 }} /> ENTRIES
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
						<Typography.Text style={{ color: 'gray' }} strong>
							<UpOutlined style={{ marginRight: 0 }} /> UP VOTED
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
						<Typography.Text style={{ color: 'gray' }} strong>
							<DownOutlined style={{ marginRight: 0 }} /> DOWN VOTED
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
