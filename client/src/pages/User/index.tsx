import React, { useState, useEffect } from 'react'
import { Card, Row, Col, Avatar, Typography, Tag, Tabs, Button, Pagination, Divider, Empty, Tooltip } from 'antd'
import { GridContent } from '@ant-design/pro-layout'
import {
	EditOutlined,
	DownOutlined,
	UpOutlined,
	CopyOutlined,
	LoadingOutlined,
	SettingOutlined,
	IdcardOutlined,
	UpSquareOutlined,
	LinkOutlined,
	SolutionOutlined,
} from '@ant-design/icons'
import { useSelector } from 'react-redux'
import { fetchAllEntriesByAuthor, fetchUserByUsername, fetchUserVotes, fetchAllFeeds } from '@/services/api'
import { router } from 'umi'
import NotFoundPage from '../404'
import { handleArrayFiltering } from '@/services/utils'
import { API_URL } from '../../../config/constants'
import PageLoading from '@/components/PageLoading'

const User: React.FC = ({ computedMatch }): JSX.Element => {
	const userState = useSelector((state: any) => state.user?.attributes.user)
	const categoryList = useSelector((state: any) => state.global.categoryList)

	const [user, setUser] = useState(userState || null)
	const [isUserFound, setIsUserFound] = useState<boolean | null>(null)

	const [currentTab, setCurrentTab] = useState('feeds')
	const [totalItems, setTotalItems] = useState<number>(0)
	const [tabView, setTabView] = useState<JSX.Element>(
		<div style={{ textAlign: 'center' }}>
			<LoadingOutlined style={{ fontSize: 20 }} />
		</div>
	)

	const readableRoles = {
		0: 'User',
		1: 'Junior Author',
		2: 'Mid Level Author',
		3: 'Senior Author',
		4: 'Admin',
		5: 'Super Admin',
	}

	useEffect(() => {
		if (!user || user.name !== computedMatch.params.username) {
			fetchUserByUsername(computedMatch.params.username)
				.then(res => {
					setUser(res.data.attributes)
					setIsUserFound(true)
				})
				.catch(error => setIsUserFound(false))
			return
		}
		setIsUserFound(true)
	}, [])

	const handleFeedsTabView = (skip: number): void => {
		fetchAllFeeds(skip, computedMatch.params.username).then(async res => {
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

			const feedList = await res.data.attributes.titles.map((title) =>
				<Row key={title.id} style={{ padding: 5 }}>
					<Col>
						{title.name}
					</Col>
					<Button onClick={(): void => router.push(`/feeds/${title.slug}`)} size="small" type="primary">
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
		fetchAllEntriesByAuthor(computedMatch.params.username, skip).then(async res => {
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

			const entryList = await res.data.attributes.entries.map((entry) =>
				<Row key={entry.id} style={{ padding: 5 }}>
					<Col>
						<Typography.Paragraph ellipsis>
							{entry.text}
						</Typography.Paragraph>
					</Col>
					<Button onClick={(): void => router.push(`/entry/${entry.id}`)} size="small" type="primary">
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
		fetchUserVotes(computedMatch.params.username, voteType, skip).then(async res => {
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

			const entryList = await res.data.attributes.entries.map((entry) =>
				<Row key={entry.id} style={{ padding: 5 }}>
					<Col>
						<Typography.Paragraph ellipsis>
							{entry.text}
						</Typography.Paragraph>
					</Col>
					<Button onClick={(): void => router.push(`/entry/${entry.id}`)} size="small" type="primary">
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
			showQuickJumper={true}
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

	const handleTabChange = (key: string): void => setCurrentTab(key)

	useEffect(() => {
		setTabView(handleLoadingView)
		setTotalItems(null)
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

	if (isUserFound === null) return <PageLoading />
	if (isUserFound === false) return <NotFoundPage />

	return (
		<GridContent>
			<Row gutter={24}>
				<Col lg={10} md={24}>
					<Card bordered={false}>
						<div style={{ textAlign: 'right', margin: '-4px 0px 5px 0px'}}>
							{userState && (userState.username === computedMatch.params.username) &&
								<SettingOutlined
									onClick={(): void => router.push('/settings')}
									style={{ fontSize: 18, cursor: 'pointer', color: '#ff2d20' }}
								/>
							}
						</div>
						<div style={{ textAlign: 'center' }}>
							<Avatar
								style={{ marginBottom: 10 }}
								size={115}
								src={`${API_URL}/v1/user/pp?username=${computedMatch.params.username}`}
							/>
							<Typography.Title level={3}> {user.full_name} </Typography.Title>
						</div>

						<Row style={{ padding: 20 }}>
							<Col span={24} style={{ fontSize: 16 }}>
								<Tooltip placement="bottom" title="Username">
									<Typography.Text>
										<IdcardOutlined style={{ marginRight: 3, color: '#ff2d20' }} /> {user.username}
									</Typography.Text>
								</Tooltip>
							</Col>
							<Col span={24} style={{ fontSize: 16 }}>
								<Tooltip placement="bottom" title="Role">
									<Typography.Text>
										<UpSquareOutlined style={{ marginRight: 3, color: '#ff2d20' }} /> {readableRoles[user.role]}
									</Typography.Text>
								</Tooltip>
							</Col>
							<Col span={24} style={{ fontSize: 16 }}>
								<Tooltip placement="bottom" title="Link">
									<LinkOutlined style={{ marginRight: 3, color: '#ff2d20' }} />
									{user.link ?
										(
											<a
												href={
													new RegExp('^(https?|ftp)://').test(user.link) ? user.link : `https://${user.link}`
												}
												target={`_${user.username}`}
											>
												{user.link}
											</a> )
										:
										( <Typography.Text> - </Typography.Text> )
									}
								</Tooltip>
							</Col>
						</Row>
						<Divider>
							<Typography.Text code>
								<SolutionOutlined style={{ marginRight: 3 }} /> Biography
							</Typography.Text>
						</Divider>
						<Col span={24} style={{ fontSize: 16 }}>
							{user.biography ?
								(<Typography.Text> {user.biography} </Typography.Text>)
								:
								(<Typography.Text> - </Typography.Text>)
							}
						</Col>
						<Divider style={{ marginBottom: 0 }} orientation="right">
							<Typography.Text secondary style={{ fontSize: 13 }}>
								Joined at {user.created_at}
							</Typography.Text>
						</Divider>
					</Card>
				</Col>
				<Col lg={14} md={24}>
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
				</Col>
			</Row>
			<br/>
		</GridContent>
	)
}

export default User
