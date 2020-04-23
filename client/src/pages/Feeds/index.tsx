import React, { useEffect, useState } from 'react'
import { Form } from '@ant-design/compatible'
import { Button, Card, List, Tag, message, BackTop, TreeSelect, Row, Col, Typography, Dropdown, Menu } from 'antd'
import { LoadingOutlined, ArrowUpOutlined, LinkOutlined, SlidersOutlined, FilterOutlined, RiseOutlined, FireOutlined, StarOutlined } from '@ant-design/icons'
import '@ant-design/compatible/assets/index.css'

import ArticleListContent from './components/ArticleListContent'
import styles from './style.less'
import { fetchAllFeeds, fetchFeaturedEntryByTitleSlug } from '@/services/api'
import { useSelector } from 'react-redux'
import { handleArrayFiltering, forgeDataTree } from '@/services/utils'
import { PageLoading } from '@ant-design/pro-layout'
import { API_URL } from '../../../config/constants'

const Feeds = (): JSX.Element => {
	const categoryList = useSelector((state: any) => state.global.categoryList)

	const [categories, setCategories] = useState<any[] | null>(null)
	const [isLoading, setIsLoading] = useState(true)
	const [categoryFilter, setCategoryFilter] = useState(null)
	const [feedList, setFeed]: any = useState([])
	const [sortBy, setSortBy] = useState('top')
	const [skipValueForPagination, setSkipValueForPagination] = useState(0)


	useEffect(() => {
		// Convert flat categories to tree category list
		const forgedCategories = forgeDataTree(categoryList)
		setCategories(forgedCategories)
	}, [])

	useEffect(() => {
		// To refresh list after applying category filters
		setFeed([])
	}, [categoryFilter])

	useEffect(() => {
		if (categories) {
			fetchAllFeeds(skipValueForPagination, null, categoryFilter)
				.then(async feedsResponse => {
					await feedsResponse.data.attributes.titles.map(async (title: any) => {
						await fetchFeaturedEntryByTitleSlug(title.slug)
							.then(async featuredEntryResponse => {
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
								await setFeed((feedList: any) => [...feedList, feed])
							})
							.catch(error => message.error(error.response.data.message, 3))
					})
				})
				.then(() => {
					setIsLoading(false)
				})
				.catch(error => {
					message.error(error.response.data.message, 3)
				})
		}
	}, [skipValueForPagination, categories, categoryFilter])


	const handleFetchMore = (): void => {
		setIsLoading(true)
		setSkipValueForPagination(skipValueForPagination + 7)
	}

	const handleSortByIcon = (): JSX.Element | void => {
		switch(sortBy){
			case 'top':
				return <RiseOutlined />
			case 'hot':
				return <FireOutlined />
			case 'new':
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

	if (isLoading) return <PageLoading />

	const handleReadableCategoryValue = (id: string[]): void => setCategoryFilter(String(id))

	return (
		<>
			<BackTop />
			<Card bordered={true}>
				<Row>
					<Col xs={19} sm={16} md={13}>
						<TreeSelect onChange={handleReadableCategoryValue}  multiple style={{ width: '100%' }} placeholder="All Categories" allowClear>
							{categories.map((data: any) => (
								<TreeSelect.TreeNode key={data.id} value={data.id} title={data.name}>
									{data.childNodes.map((child: any) => (
										<TreeSelect.TreeNode key={child.id} value={child.id} title={child.name} />
									))}
								</TreeSelect.TreeNode>
							))}
						</TreeSelect>
					</Col>
					<Col />
					<Dropdown
						overlay={
							<Menu>
								<Menu.Item onClick={(): void => setSortBy('hot')}>
									<Typography.Text>
										<FireOutlined /> Hot
									</Typography.Text>
								</Menu.Item>
								<Menu.Item onClick={(): void => setSortBy('top')}>
									<Typography.Text>
									 	<RiseOutlined /> Top
									</Typography.Text>
								</Menu.Item>
								<Menu.Item onClick={(): void => setSortBy('new')}>
									<Typography.Text>
										<StarOutlined /> New
									</Typography.Text>
								</Menu.Item>
							</Menu>
						}
					>
						<Button>
							SORT BY {handleSortByIcon()}
						</Button>
					</Dropdown>
				</Row>
			</Card>
			<Card
				style={{
					marginTop: 24,
				}}
				bordered={false}
				bodyStyle={{
					padding: '8px 32px 32px 32px',
				}}
			>
				<List<any>
					style={{ margin: 15 }}
					size="large"
					loading={feedList.length === 0 ? isLoading : false}
					rowKey="id"
					itemLayout="vertical"
					loadMore={loadMore}
					dataSource={feedList}
					renderItem={(item): JSX.Element => (
						<List.Item
							key={item.id}
							actions={[
								<span>
									<ArrowUpOutlined
										style={{
											marginRight: 8,
										}}
									/>
									{item.entry.votes}
								</span>,
								<span>
									<LinkOutlined style={{ marginRight: 8 }} />
									Share
								</span>
							]}
							extra={<div className={styles.listItemExtra} />}
						>
							<List.Item.Meta
								title={
									<a className={styles.listItemMetaTitle} href={item.href}>
										{item.name}
									</a>
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
		</>
	)
}

export default Feeds
