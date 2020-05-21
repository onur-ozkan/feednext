// Antd dependencies
import {
	Button,
	Card,
	List,
	Tag,
	message,
	BackTop,
	Row,
	Col,
	Typography,
	Modal
} from 'antd'
import { LoadingOutlined, ArrowUpOutlined, LinkOutlined } from '@ant-design/icons'

// Other dependencies
import React, { useEffect, useState } from 'react'
import { AxiosError, AxiosResponse } from 'axios'
import { Link } from 'umi'

// Local files
import { fetchAllFeeds, fetchFeaturedEntryByTitleId, fetchTrendingCategories, fetchOneCategory } from '@/services/api'
import { CategorySelect } from '@/components/CategorySelect'
import { API_URL } from '@/../config/constants'
import { PageHelmet } from '@/components/PageHelmet'
import { AdditionalBlock } from './components/AdditionalBlock'
import { TrendingCategoriesResponseData } from '@/@types/api'
import { FeedList } from './types'
import ArticleListContent from './components/ArticleListContent'
import globalStyles from '@/global.less'
import FlowHeader from './components/FlowHeader'

const Feeds = (): JSX.Element => {
	const [displayFilterModal, setDisplayFilterModal] = useState(false)
	const [trendingCategories, setTrendingCategories] = useState<TrendingCategoriesResponseData[] | undefined>(undefined)
	const [categoryFilter, setCategoryFilter] = useState<string | undefined>(undefined)
	const [feedList, setFeed] = useState<FeedList[]>([])
	const [sortBy, setSortBy] = useState<'hot' | 'top' | undefined>(undefined)
	const [skipValueForPagination, setSkipValueForPagination] = useState(0)
	const [canLoadMore, setCanLoadMore] = useState(false)
	const [isLoading, setIsLoading] = useState(true)

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
			.then((feedsResponse: AxiosResponse) => {

				if (feedsResponse.data.attributes.count > feedList?.length) setCanLoadMore(true)
				else setCanLoadMore(false)

				feedsResponse.data.attributes.titles.map(async (title: any) => {
					const categoryName = await fetchOneCategory(title.category_id).then(({ data }) => data.attributes.name)
					await fetchFeaturedEntryByTitleId(title.id)
						.then(async featuredEntryResponse => {
							const feed = {
								id: title.id,
								slug: title.slug,
								name: title.name,
								href: `/${title.slug}`,
								categoryName: categoryName,
								createdAt: title.created_at,
								updatedAt: title.updated_at,
								entryCount: title.entry_count,
								featuredEntry: {
									id: featuredEntryResponse.data.attributes.id,
									avatar: `${API_URL}/v1/user/pp?username=${featuredEntryResponse.data.attributes.written_by}`,
									text: featuredEntryResponse.data.attributes.text,
									createdAt: featuredEntryResponse.data.attributes.created_at,
									updatedAt: featuredEntryResponse.data.attributes.updated_at,
									voteValue: featuredEntryResponse.data.attributes.votes.value,
									writtenBy: featuredEntryResponse.data.attributes.written_by,
								},
							}
							setFeed((feedList: FeedList[]) => [...feedList, feed])
						})
						.catch(_error => {
							const feed: any = {
								id: title.id,
								slug: title.slug,
								name: title.name,
								href: `/${title.slug}`,
								categoryName: categoryName,
								createdAt: title.created_at,
								updatedAt: title.updated_at,
								entryCount: title.entry_count,
							}
							setFeed((feedList: FeedList[]) => [...feedList, feed])
						})
				})
			})
			.catch((error: AxiosError) => message.error(error.response?.data.message))
		setIsLoading(false)
	}

	const handleEntryListRender = (): JSX.Element => {
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
								<span style={{ cursor: 'pointer' }}>
									<LinkOutlined style={{ marginRight: 3 }} />
									Share
								</span>
							</div>
						]}
					>
						<List.Item.Meta
							title={
								<Row>
									<Col>
										<Link
											to={item.href}
											style={{ cursor: 'pointer' }}
										>
											<Typography.Text style={{ fontSize: 17 }}>
												{item.name}
											</Typography.Text>
										</Link>

									</Col>
									<Col style={{ position: 'absolute', right: 0 }}>
										<img
											width={100}
											style={{
												maxHeight: 100
											}}
											src={`${API_URL}/v1/title/${item.id}/image`}
											alt="Title Image"
										/>
									</Col>
								</Row>
							}
							description={ <Tag> {item.categoryName.toUpperCase()} </Tag>
							}
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
						<Row key={category.id} style={{ marginBottom: 10, marginTop: 10,  alignItems: 'center'  }}>
							<Col>
								<Typography.Text strong>
									{category.name.length > 17 ? `${category.name.substring(0, 15).toUpperCase()}..` : category.name.toUpperCase()}
								</Typography.Text>
							</Col>
							<Button onClick={(): void => setCategoryFilter(category.id)} type="primary" key={category.id}>
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


	const handleFetchMore = (): void => setSkipValueForPagination(skipValueForPagination + 10)

	const loadMore = canLoadMore && (
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
		<>
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
				<Col xl={16} lg={14} md={24} sm={24} style={{ padding: 7 }}>
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
							antBtnLinkStyle={globalStyles.antBtnLink}
						/>
						{handleModalScreen()}
						{handleEntryListRender()}
					</Card>
				</Col>
				<Col xl={8} lg={10} md={24} sm={24} style={{ padding: 7 }}>
					<Card style={{ marginBottom: 14 }} bordered={false} title="Trending Categories">
						{handleTrendingCategoriesRender()}
					</Card>
					<AdditionalBlock />
				</Col>
			</Row>
			<br/>
		</>
	)
}

export default Feeds
