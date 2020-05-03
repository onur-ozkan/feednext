import React, { useEffect, useState } from 'react'
import { Button, Card, List, Tag, message, BackTop, TreeSelect, Row, Col, Typography, Dropdown, Menu, Modal } from 'antd'
import { LoadingOutlined, ArrowUpOutlined, LinkOutlined, RiseOutlined, FilterFilled, CheckOutlined, StarFilled, FireFilled } from '@ant-design/icons'
import '@ant-design/compatible/assets/index.css'

import ArticleListContent from './components/ArticleListContent'
import globalStyles from '@/global.less'
import { fetchAllFeeds, fetchFeaturedEntryByTitleId, fetchTrendingCategories } from '@/services/api'
import { useSelector } from 'react-redux'
import { handleArrayFiltering } from '@/services/utils'
import { API_URL } from '../../../config/constants'
import { Link } from 'umi'

const Feeds = (): JSX.Element => {
	const globalState = useSelector((state: any) => state.global)

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
		fetchAllFeeds(skipValueForPagination, null, categoryFilter, sortBy)
			.then(feedsResponse => {
				feedsResponse.data.attributes.titles.map(async (title: any) => {
					await fetchFeaturedEntryByTitleId(title.id)
						.then(featuredEntryResponse => {
							const feed = {
								id: title.id,
								slug: title.slug,
								name: title.name,
								href: `/feeds/${title.slug}`,
								categoryName: handleArrayFiltering(globalState.categoryList, title.category_id).name,
								createdAt: title.created_at,
								updatedAt: title.updated_at,
								entryCount: title.entry_count,
								entry: {
									id: featuredEntryResponse.data.attributes.id,
									avatar: `${API_URL}/v1/user/${featuredEntryResponse.data.attributes.written_by}/pp`,
									text: featuredEntryResponse.data.attributes.text,
									createdAt: featuredEntryResponse.data.attributes.created_at,
									updatedAt: featuredEntryResponse.data.attributes.updated_at,
									voteValue: featuredEntryResponse.data.attributes.votes.value,
									writtenBy: featuredEntryResponse.data.attributes.written_by,
								},
							}
							setFeed((feedList: any) => [...feedList, feed])
						})
						.catch(_error => {
							const feed = {
								id: title.id,
								slug: title.slug,
								name: title.name,
								href: `/feeds/${title.slug}`,
								categoryName: handleArrayFiltering(globalState.categoryList, title.category_id).name,
								createdAt: title.created_at,
								updatedAt: title.updated_at,
								entryCount: title.entry_count,
							}
							setFeed((feedList: any) => [...feedList, feed])
						})
				})
			})
			.catch(error => {
				message.error(error.response.data.message, 3)
			})

		if (!trendingCategories) {
			fetchTrendingCategories()
				.then(res => setTrendingCategories(res.data.attributes.categories))
		}

	}

	const handleEntryListRender = (): JSX.Element => {
		if (feedList.length === 0) {
			return (
				<div style={{ textAlign: 'center', marginTop: 61 }}>
					<LoadingOutlined spin style={{ fontSize: 25 }} />
				</div>
			)
		}

		return (
			<List<any>
				style={{ margin: 25 }}
				loading={feedList.length === 0}
				rowKey="id"
				itemLayout="vertical"
				loadMore={loadMore}
				dataSource={feedList}
				renderItem={(item): JSX.Element => (
					<List.Item
						key={item.id}
						actions={[
							<>
								{item.entry && (
									<span style={{ marginRight: 10 }}>
										<ArrowUpOutlined style={{ marginRight: 3 }} />
										{item.entry.voteValue}
									</span>
								)}
								<span>
									<LinkOutlined style={{ marginRight: 3 }} />
									Share
								</span>
							</>
						]}
					>
						<List.Item.Meta
							title={
								<Link
									to={item.href}
									style={{ cursor: 'pointer' }}
								>
									{item.name}
								</Link>
							}
							description={ <Tag> {item.categoryName.toUpperCase()} </Tag>
							}
						/>
						{item.entry ?
								<ArticleListContent data={item.entry} />
							:
								<Typography.Text strong> No Entry Found </Typography.Text>
						}
					</List.Item>
				)}
			/>
		)
	}

	const handleTrendingCategoriesRender = (): JSX.Element => {

		if (!trendingCategories) {
			return (
				<div style={{ textAlign: 'center' }}>
					<LoadingOutlined spin style={{ fontSize: 25 }} />
				</div>
			)
		}

		return (
			<div style={{ marginTop: -20 }}>
				{trendingCategories.map(category => {
					return (
						<List.Item
							key={category.id}
							style={{ marginBottom: -10 }}
							actions={[
								<Button onClick={(): void => setCategoryFilter(category.id)} type="primary" key={category.id}>
									<Typography.Text
										style={{ color: 'white' }}
										strong
									>
										Display
									</Typography.Text>
								</Button>
							]}
						>
							<Typography.Text strong>
								{category.name.toUpperCase()}
							</Typography.Text>
						</List.Item>
					)
				})}
			</div>
		)
	}

	useEffect(() => {
		handleDataFetching()
	}, [skipValueForPagination, categoryFilter, sortBy])


	const handleFetchMore = (): void => setSkipValueForPagination(skipValueForPagination + 10)

	const handleSortByIcon = (): JSX.Element | void => {
		switch(sortBy){
			case 'top':
				return <RiseOutlined style={{ color: '#188fce' }} />
			case 'hot':
				return <FireFilled style={{ color: 'red' }} />
			default:
				return <StarFilled style={{ color: '#00c853' }} />
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
				More
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
					<TreeSelect
						onChange={(id: string[]): void => setSelectedCategoryFromTree(String(id))}
						multiple
						showSearch={false}
						treeData={globalState.categoryTree}
						style={{ width: '100%' }}
						placeholder="All Categories"
						allowClear
					/>
				</Col>
				<Button shape="circle" icon={<CheckOutlined />} onClick={handleCategoryFilter} />
			</Row>
		</Modal>
	)

	return (
		<>
			<BackTop />
			<Row>
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
								className={globalStyles.antBtnLink}
								type="link"
								style={{ marginRight: 5 }}
								icon={<FilterFilled />}
							>
								FILTER
							</Button>
							<Dropdown
								trigger={['click']}
								overlay={
									<Menu>
										<Menu.Item onClick={(): void => setSortBy(null)}>
											<Typography.Text>
												<StarFilled style={{ color: '#00c853' }} /> New
											</Typography.Text>
										</Menu.Item>
										<Menu.Item onClick={(): void => setSortBy('top')}>
											<Typography.Text>
												<RiseOutlined style={{ color: '#188fce' }} /> Top
											</Typography.Text>
										</Menu.Item>
										<Menu.Item onClick={(): void => setSortBy('hot')}>
											<Typography.Text>
												<FireFilled style={{ color: 'red' }} /> Hot
											</Typography.Text>
										</Menu.Item>
									</Menu>
								}
							>
								<Button className={globalStyles.antBtnLink} type="link">
									SORT BY {handleSortByIcon()}
								</Button>
							</Dropdown>
						</Row>
						{handleModalScreen()}
						{handleEntryListRender()}
					</Card>
				</Col>
				<Col lg={9} md={24} style={{ padding: 7 }}>
					<Card style={{ marginBottom: 14 }} bordered={false} title="Trending Categories">
						{handleTrendingCategoriesRender()}
					</Card>
					<Card>
						<Row style={{ marginBottom: 15 }}>
							<Col span={12}>
								<Link to="/about">
									<Typography.Text strong>
										About
									</Typography.Text>
								</Link>
							</Col>
							<Col span={12}>
								<a href="https://github.com/ozkanonur/feednext#readme" target="_api">
									<Typography.Text strong>
										API
									</Typography.Text>
								</a>
							</Col>
							<Col span={12}>
								<Typography.Text strong>
									Support
								</Typography.Text>
							</Col>
							<Col span={12}>
								<a href="https://github.com/ozkanonur/feednext/blob/master/COPYING" target="_license">
									<Typography.Text strong>
										License
									</Typography.Text>
								</a>
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
