// Antd dependencies
import {
	Button,
	Card,
	List,
	message,
	BackTop,
	Row,
	Col,
	Typography,
	Modal
} from 'antd'
import { LoadingOutlined, ArrowUpOutlined } from '@ant-design/icons'

// Other dependencies
import React, { useEffect, useState } from 'react'
import { AxiosError, AxiosResponse } from 'axios'
import Link from 'next/link'

// Local files
import { fetchAllFeeds, fetchFeaturedEntryByTitleId, fetchTrendingCategories, fetchOneCategory } from '@/services/api'
import { CategorySelect } from '@/components/CategorySelect'
import { API_URL, Guest } from '@/../config/constants'
import { PageHelmet } from '@/components/PageHelmet'
import { AdditionalBlock } from './components/AdditionalBlock'
import { TrendingCategoriesResponseData } from '@/@types/api'
import { FeedList } from './types'
import ArticleListContent from './components/ArticleListContent'
import FlowHeader from './components/FlowHeader'
import AppLayout from '@/layouts/AppLayout'

const Feeds = (): JSX.Element => {
	const [displayFilterModal, setDisplayFilterModal] = useState(false)
	const [trendingCategories, setTrendingCategories] = useState<TrendingCategoriesResponseData[] | undefined>(undefined)
	const [categoryFilter, setCategoryFilter] = useState<string | undefined>(undefined)
	const [feedList, setFeed] = useState<FeedList[]>([])
	const [sortBy, setSortBy] = useState<'hot' | 'top' | undefined>(undefined)
	const [skipValueForPagination, setSkipValueForPagination] = useState(0)
	const [canLoadMore, setCanLoadMore] = useState(false)
	const [isLoading, setIsLoading] = useState(true)
	const [isFetching, setIsFetching] = useState(false)

	useEffect(() => {
		setFeed([])
		setSkipValueForPagination(0)
	}, [categoryFilter, sortBy])

	const handleDataFetching = async (): Promise<void> => {
		if (!trendingCategories) {
			fetchTrendingCategories()
				.then(res => setTrendingCategories(res.data.attributes.categories))
		}

		await fetchAllFeeds(skipValueForPagination, undefined, categoryFilter, sortBy)
			.then(async (feedsResponse: AxiosResponse) => {
				if (feedsResponse.data.attributes.count > feedList.length) setCanLoadMore(true)
				else setCanLoadMore(false)

				const promises = await feedsResponse.data.attributes.titles.map(async (title: any) => {
					const categoryName = await fetchOneCategory(title.category_id).then(({ data }) => data.attributes.name)
					const featuredEntry: any = await fetchFeaturedEntryByTitleId(title.id).then(featuredEntryResponse => featuredEntryResponse.data.attributes)
					.catch(_error => {})

					const feed = {
						id: title.id,
						slug: title.slug,
						name: title.name,
						href: `/${title.slug}`,
						categoryName: categoryName,
						createdAt: title.created_at,
						updatedAt: title.updated_at,
						entryCount: title.entry_count,
						...featuredEntry && {
							featuredEntry: {
								id: featuredEntry.id,
								avatar: `${API_URL}/v1/user/pp?username=${featuredEntry.written_by}`,
								text: featuredEntry.text,
								createdAt: featuredEntry.created_at,
								updatedAt: featuredEntry.updated_at,
								voteValue: featuredEntry.votes.value,
								writtenBy: featuredEntry.written_by,
							}
						}
					}
					return feed
				})

				const result = await Promise.all(promises)

				/* TODO
				* This is a workaround to fix wrong list order of Feeds Flow.
				* Updating feeds should be refactored.
				*/
				result.map(item => setFeed((feedList: FeedList[]) => [...feedList, item]))

			})
			.catch((error: AxiosError) => message.error(error.response?.data.message))
		setIsLoading(false)
		setIsFetching(false)
	}

	const handleFeedListView = (): JSX.Element => {
		if (isLoading) {
			return (
				<div style={{ textAlign: 'center', marginTop: 61 }}>
					<LoadingOutlined spin style={{ fontSize: 25 }} />
				</div>
			)
		}

		return (
			<List<FeedList>
				style={{ marginTop: 25 }}
				rowKey="id"
				size="large"
				itemLayout="vertical"
				loadMore={loadMore}
				dataSource={feedList}
				renderItem={(item): JSX.Element => (
					<List.Item
						key={item.id}
						actions={[
							<div key="_" style={{ cursor: 'default' }}>
								{item.featuredEntry && (
									<span style={{ marginRight: 10 }}>
										<ArrowUpOutlined style={{ marginRight: 3 }} />
										{item.featuredEntry.voteValue}
									</span>
								)}
							</div>
						]}
					>
						<List.Item.Meta
							title={
								<Row>
									<Col>
										<Link
											href={item.href}
											style={{ cursor: 'pointer' }}
										>
											<Typography.Text style={{ fontSize: 17 }}>
												{item.name}
											</Typography.Text>
										</Link>

									</Col>
								</Row>
							}
							avatar={
								<img
									width={100}
									src={`${API_URL}/v1/title/${item.id}/image`}
									alt="Title Image"
								/>
							}
							description={item.categoryName.toUpperCase()}
						/>
						{item.featuredEntry ?
								<ArticleListContent data={item.featuredEntry} />
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
						<Row key={category.id} style={{ marginBottom: 15, marginTop: 15,  alignItems: 'center'  }}>
							<Col>
								<Typography.Text strong>
									{category.name.length > 17 ? `${category.name.substring(0, 15).toUpperCase()}..` : category.name.toUpperCase()}
								</Typography.Text>
							</Col>
							<Button style={{ position: 'absolute', right: 15 }} onClick={(): void => setCategoryFilter(category.id)} type="primary" key={category.id}>
								<Typography.Text
									style={{ color: 'white' }}
									strong
								>
									Display
								</Typography.Text>
							</Button>
						</Row>
					)
				})}
			</div>
		)
	}

	useEffect(() => {
		handleDataFetching()
	}, [skipValueForPagination, categoryFilter, sortBy])

	const handleFetchMore = (): void => {
		setIsFetching(true)
		setSkipValueForPagination(skipValueForPagination + 10)
	}

	const loadMore = canLoadMore && (
		<div style={{ textAlign: 'center', marginTop: 16 }}>
			<Button
				onClick={handleFetchMore}
				style={{
					paddingLeft: 48,
					paddingRight: 48,
				}}
			>
				{isFetching ? <LoadingOutlined /> : 'More'}
			</Button>
		</div>
	)

	const handleModalScreen = (): JSX.Element => (
		<Modal
			transitionName='fade'
			style={{ textAlign: 'center'}}
			visible={displayFilterModal}
			closable={false}
			footer={null}
			onCancel={(): void => setDisplayFilterModal(false)}
		>
			<CategorySelect
				multiple
				onSelect={(id): void => setCategoryFilter(String(id))}
				style={{ width: '100%' }}
				placeHolder="All Categories"
				allowClear
			/>
		</Modal>
	)

	return (
		<AppLayout authority={Guest}>
			<PageHelmet
				title="Feednext: the source of feedbacks"
				description="Best reviews, comments, feedbacks about anything around the world"
				mediaTitle="the source of the feedbacks"
				mediaImage="https://avatars1.githubusercontent.com/u/64217221?s=200&v=4"
				mediaDescription="Best reviews, comments, feedbacks about anything around the world"
				keywords="reviews, comments, feedbacks, peruse"
			/>
			<BackTop />
			<Row>
				<Col xl={16} lg={14} md={24} sm={24} xs={24} style={{ padding: 4 }}>
					<Card
						bordered={false}
						bodyStyle={{
							padding: '8px 32px 32px 32px',
						}}
					>
						<FlowHeader
							openFilterModal={(): void => setDisplayFilterModal(true)}
							setSortBy={(val: 'top' | 'hot' | undefined): void => setSortBy(val)}
							resetCategoryFilter={(): void => setCategoryFilter(undefined)}
							sortBy={sortBy}
						/>
						{handleModalScreen()}
						{handleFeedListView()}
					</Card>
				</Col>
				<Col xl={8} lg={10} md={24} sm={24} xs={24} style={{ padding: 4 }}>
					<Card style={{ marginBottom: 8 }} bordered={false} title="Trending Categories">
						{handleTrendingCategoriesRender()}
					</Card>
					<AdditionalBlock />
				</Col>
			</Row>
			<br/>
		</AppLayout>
	)
}

export default Feeds
