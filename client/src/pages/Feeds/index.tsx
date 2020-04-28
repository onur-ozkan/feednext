import React, { useEffect, useState } from 'react'
import { Button, Card, List, Tag, message, BackTop, TreeSelect, Row, Col, Typography, Dropdown, Menu, Modal } from 'antd'
import { LoadingOutlined, ArrowUpOutlined, LinkOutlined, RiseOutlined, FireOutlined, StarOutlined, FilterFilled, CheckOutlined } from '@ant-design/icons'
import '@ant-design/compatible/assets/index.css'

import ArticleListContent from './components/ArticleListContent'
import styles from './style.less'
import { fetchAllFeeds, fetchFeaturedEntryByTitleId, fetchTrendingCategories } from '@/services/api'
import { useSelector } from 'react-redux'
import { handleArrayFiltering, forgeDataTree } from '@/services/utils'
import { PageLoading } from '@ant-design/pro-layout'
import { API_URL } from '../../../config/constants'
import { router } from 'umi'

const Feeds = (): JSX.Element => {
	const categoryList = useSelector((state: any) => state.global.categoryList)

	const [categories, setCategories] = useState<any[] | null>(null)
	const [isLoading, setIsLoading] = useState(true)
	const [displayFilterModal, setDisplayFilterModal] = useState(false)
	const [selectedCategoryFromTree, setSelectedCategoryFromTree] = useState(null)
	const [trendingCategories, setTrendingCategories] = useState(null)
	const [categoryFilter, setCategoryFilter] = useState(null)
	const [feedList, setFeed]: any = useState([])
	const [sortBy, setSortBy] = useState(null)
	const [skipValueForPagination, setSkipValueForPagination] = useState(0)

	useEffect(() => {
		setFeed([])
		setSkipValueForPagination(0)
	}, [categoryFilter, sortBy])

	const handleDataFetching = (): void => {
		const forgedCategories = forgeDataTree(categoryList)
		setCategories(forgedCategories)

		fetchAllFeeds(skipValueForPagination, null, categoryFilter, sortBy)
			.then(feedsResponse => {
				feedsResponse.data.attributes.titles.map((title: any) => {
					fetchFeaturedEntryByTitleId(title.id)
						.then(featuredEntryResponse => {
							const feed = {
								id: title.id,
								slug: title.slug,
								name: title.name,
								href: `/feeds/${title.slug}`,
								categoryName: handleArrayFiltering(categoryList, title.category_id).name,
								createdAt: title.created_at,
								updatedAt: title.updated_at,
								entryCount: title.entry_count,
								entry: {
									id: featuredEntryResponse.data.attributes.id,
									avatar: `${API_URL}/v1/user/${featuredEntryResponse.data.attributes.written_by}/pp`,
									text: featuredEntryResponse.data.attributes.text,
									createdAt: featuredEntryResponse.data.attributes.created_at,
									updatedAt: featuredEntryResponse.data.attributes.updated_at,
									votes: featuredEntryResponse.data.attributes.votes,
									writtenBy: featuredEntryResponse.data.attributes.written_by,
								},
							}
							setFeed((feedList: any) => [...feedList, feed])
						})
						.catch(error => message.error(error.response.data.message, 3))
				})
			})
			.catch(error => {
				message.error(error.response.data.message, 3)
			})

		if (isLoading) {
			fetchTrendingCategories().then(res => {
				setTrendingCategories(res.data.attributes.categories)
				setIsLoading(false)
			})
		}

	}

	useEffect(() => {
		handleDataFetching()
	}, [skipValueForPagination, categoryFilter, sortBy])


	const handleFetchMore = (): void => setSkipValueForPagination(skipValueForPagination + 7)

	const handleSortByIcon = (): JSX.Element | void => {
		switch(sortBy){
			case 'top':
				return <RiseOutlined />
			case 'hot':
				return <FireOutlined />
			default:
				return <StarOutlined />
		}
	}

	const loadMore = feedList.length > 0 && (
		<div style={{ textAlign: 'center', marginTop: 16 }}>
			<Button
				onClick={handleFetchMore}
				style={{
					paddingLeft: 48,
					paddingRight: 48,
				}}
			>
				{isLoading ? (
					<LoadingOutlined />
				) : (
					'More'
				)}
			</Button>
		</div>
	)

	const handleCategoryFilter = (): void => {
		setCategoryFilter(selectedCategoryFromTree)
		setDisplayFilterModal(false)
	}

	const onModalCancel = (): void => {
		setSelectedCategoryFromTree(null)
		setDisplayFilterModal(false)
	}


	const handleModalScreen = (): JSX.Element => (
		<Modal
			transitionName='fade'
			style={{ textAlign: 'center'}}
			visible={displayFilterModal}
			closable={false}
			footer={null}
			onCancel={onModalCancel}
		>
			<Row>
				<Col style={{ marginRight: 10 }}>
					<TreeSelect onChange={(id: string[]): void => setSelectedCategoryFromTree(String(id))}  multiple style={{ width: '100%' }} placeholder="All Categories" allowClear>
						{categories.map((data: any) => (
							<TreeSelect.TreeNode key={data.id} value={data.id} title={data.name}>
								{data.childNodes.map((child: any) => (
									<TreeSelect.TreeNode key={child.id} value={child.id} title={child.name} />
								))}
							</TreeSelect.TreeNode>
						))}
					</TreeSelect>
				</Col>
				<Button shape="circle" icon={<CheckOutlined />} onClick={handleCategoryFilter} />
			</Row>
		</Modal>
	)

	if (isLoading) return <PageLoading />

	return (
		<>
			<BackTop />
			<Row style={{ marginTop: 15 }}>
				<Col lg={15} md={24} style={{ padding: 7 }}>
					<Card
						bordered={false}
						bodyStyle={{
							padding: '8px 32px 32px 32px',
						}}
					>
						<Row style={{ margin: '10px -15px -25px 0px', position: 'relative', zIndex: 1 }}>
						<Col />
							<Button
								onClick={(): void => setDisplayFilterModal(true)}
								className={styles.antBtnLink}
								type="link"
								style={{ marginRight: 5 }}
								icon={<FilterFilled />}
							>
								Filter
							</Button>
							<Dropdown
								trigger={['click']}
								overlay={
									<Menu>
										<Menu.Item onClick={(): void => setSortBy(null)}>
											<Typography.Text>
												<StarOutlined /> New
											</Typography.Text>
										</Menu.Item>
										<Menu.Item onClick={(): void => setSortBy('top')}>
											<Typography.Text>
												<RiseOutlined /> Top
											</Typography.Text>
										</Menu.Item>
										<Menu.Item onClick={(): void => setSortBy('hot')}>
											<Typography.Text>
												<FireOutlined /> Hot
											</Typography.Text>
										</Menu.Item>
									</Menu>
								}
							>
								<Button className={styles.antBtnLink} type="link">
									SORT BY {handleSortByIcon()}
								</Button>
							</Dropdown>
						</Row>
						{handleModalScreen()}
						<List<any>
							style={{ margin: 15 }}
							loading={isLoading}
							rowKey="id"
							itemLayout="vertical"
							loadMore={loadMore}
							dataSource={feedList}
							renderItem={(item): JSX.Element => (
								<List.Item
									style={{ width: '100vh' }}
									key={item.id}
									actions={[
										<>
											<span style={{ marginRight: 10 }}>
												<ArrowUpOutlined style={{ marginRight: 3 }} />
												{item.entry.votes}
											</span>
											<span>
												<LinkOutlined style={{ marginRight: 3 }} />
												Share
											</span>
										</>
									]}
									extra={<div className={styles.listItemExtra} />}
								>
									<List.Item.Meta
										title={
											<span style={{ cursor: 'pointer' }} onClick={(): void => router.push(item.href)}>
												<Typography.Text> {item.name} </Typography.Text>
											</span>
										}
										description={
											<span>
												<Tag>{item.categoryName}</Tag>
											</span>
										}
									/>
									<ArticleListContent data={item.entry} />
								</List.Item>
							)}
						/>
					</Card>
				</Col>
				<Col lg={9} md={24} style={{ padding: 7 }}>
					<Card style={{ marginBottom: 14 }} bordered={false} title="Trending Categories">
						<div style={{ marginTop: -20 }}>
							{trendingCategories.map(category => {
								return (
									<List.Item
										key={category.id}
										style={{ marginBottom: -10 }}
										actions={[
											<Button onClick={(): void => setCategoryFilter(category.id)} type="primary" key={category.id}>
												Display
											</Button>
										]}
									>
										{category.name}
									</List.Item>
								)
							})}
						</div>
					</Card>
					<Card>
						<Row style={{ marginBottom: 15 }}>
							<Col span={12}>
								<Row>
									<Typography.Text strong>
										About
									</Typography.Text>
								</Row>
								<Row>
									<Typography.Text strong>
										Github
									</Typography.Text>
								</Row>
								<Row>
									<Typography.Text strong>
										Policy
									</Typography.Text>
								</Row>
							</Col>
							<Col span={12}>
								<Row>
									<Typography.Text strong>
										Support
									</Typography.Text>
								</Row>
								<Row>
									<Typography.Text strong>
										API
									</Typography.Text>
								</Row>
							</Col>
						</Row>
						<Row>
							<Typography.Text>
								Feednext © 2020. All rights reserved
							</Typography.Text>
						</Row>
					</Card>
				</Col>
			</Row>
			<br/>
		</>
	)
}

export default Feeds
