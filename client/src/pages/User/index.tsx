import React, { useState, useEffect } from 'react'
import { Card, Row, Col, Avatar, Typography, Tag, Tabs, Button, Pagination, Divider, Empty } from 'antd'
import { GridContent, PageLoading } from '@ant-design/pro-layout'
import {
	UserOutlined,
	EditOutlined,
	DownOutlined,
	UpOutlined,
	CopyOutlined,
	SettingTwoTone,
	IdcardTwoTone,
	UpSquareTwoTone,
	CrownTwoTone,
	LoadingOutlined,
} from '@ant-design/icons'
import { useSelector } from 'react-redux'
import { fetchAllFeedsByAuthor, fetchAllEntriesByAuthor, fetchUserByUsername } from '@/services/api'
import { router } from 'umi'
import NotFoundPage from '../404'
import { handleArrayFiltering } from '@/services/utils'

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
		fetchAllFeedsByAuthor(computedMatch.params.username, skip).then(async res => {
			setTotalItems(res.data.attributes.count)

			if (res.data.attributes.titles.length === 0) {
				setTabView(<Empty description="No Feed Found" image={Empty.PRESENTED_IMAGE_SIMPLE} />)
				return
			}

			const feedList = await res.data.attributes.titles.map((title) =>
				<Row key={title.id} style={{ padding: 5 }}>
					<Col span={4}>
						<Tag> {handleArrayFiltering(categoryList, title.category_id).name} </Tag>
					</Col>
					<Col span={16}>
						{title.name}
					</Col>
					<Col span={4}>
						<Button onClick={(): void => router.push(`/feeds/${title.slug}`)} size="small" type="primary">
							Open
						</Button>
					</Col>
				</Row>
			)
			setTabView(feedList)
		})
	}

	const handleEntriesTabView = (skip: number): void => {
		fetchAllEntriesByAuthor(computedMatch.params.username, skip).then(async res => {
			setTotalItems(res.data.attributes.count)

			if (res.data.attributes.entries.length === 0) {
				setTabView(<Empty description="No Entry Found" image={Empty.PRESENTED_IMAGE_SIMPLE} />)
				return
			}

			const feedList = await res.data.attributes.entries.map((entry) =>
				<Row key={entry.id} style={{ padding: 5 }}>
					<Col span={20}>
						{entry.text}
					</Col>
					<Col span={4}>
						<Button onClick={(): void => router.push(`/entry/${entry.id}`)} size="small" type="primary">
							Open
						</Button>
					</Col>
				</Row>
			)
			setTabView(feedList)
		})
	}

	const handleLoadingView = (
		<div style={{ textAlign: 'center' }}>
			<LoadingOutlined style={{ fontSize: 20 }} />
		</div>
	)

	const handlePagination = (func: Function): JSX.Element => (
		<Pagination
			size="small"
			showLessItems={true}
			showQuickJumper={true}
			defaultCurrent={1}
			pageSize={10}
			total={totalItems}
			onChange={
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
			case 'votes':
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
						{userState &&
							<div style={{ textAlign: 'right', margin: '-4px 0px 5px 0px'}}>
								<SettingTwoTone style={{ fontSize: 18 }} />
							</div>
						}
						<div style={{ textAlign: 'center' }}>
							<Avatar style={{ marginBottom: 10 }} size={115} icon={<UserOutlined />} />
							<Typography.Title level={3}> {user.full_name} </Typography.Title>
						</div>

						<Row>
							<Col span={24}>
								<Typography.Text>
									<IdcardTwoTone style={{ marginRight: 3 }} /> {user.username}
								</Typography.Text>
							</Col>
							<Col span={24}>
								<Typography.Text>
									<UpSquareTwoTone style={{ marginRight: 3 }} /> {readableRoles[user.role]}
								</Typography.Text>
							</Col>
							<Col span={24}>
								<Typography.Text>
									<CrownTwoTone style={{ marginRight: 3 }} /> 61
								</Typography.Text>
							</Col>
						</Row>
					</Card>
					<Card bordered>
						<Typography.Title level={4}> Most feeded categories </Typography.Title>
						<Tag style={{ margin: '3px 5px 3px 0px' }}> Example Category </Tag>
						<Tag style={{ margin: '3px 5px 3px 0px' }}> Example Category </Tag>
						<Tag style={{ margin: '3px 5px 3px 0px' }}> Example Category </Tag>
						<Tag style={{ margin: '3px 5px 3px 0px' }}> Example Category </Tag>
						<Tag style={{ margin: '3px 5px 3px 0px' }}> Example Category </Tag>
						<Tag style={{ margin: '3px 5px 3px 0px' }}> Example Category </Tag>
						<Tag style={{ margin: '3px 5px 3px 0px' }}> Example Category </Tag>
						<Tag style={{ margin: '3px 5px 3px 0px' }}> Example Category </Tag>
					</Card>
				</Col>
				<Col lg={12} md={24}>
					<Card bordered={false}>
						<Tabs onChange={handleTabChange} defaultActiveKey={currentTab}>
							<Tabs.TabPane
								tab={
									<Typography.Text strong>
										<CopyOutlined /> Feeds
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
										<EditOutlined /> Entries
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
										<UpOutlined />
										<DownOutlined style={{ margin: '0px 0px 0px -9px'}} /> Votes
									</Typography.Text>
								}
								key="votes"
							>
								{tabView}
							</Tabs.TabPane>
						</Tabs>
					</Card>
				</Col>
			</Row>
		</GridContent>
	)
}

export default User
