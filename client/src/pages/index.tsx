// Antd dependencies
import { Button, Card, List, message, BackTop, Row, Col, Typography, Modal, Skeleton, Select } from 'antd'
import { LoadingOutlined, ArrowUpOutlined } from '@ant-design/icons'

// Other dependencies
import React, { useEffect, useState } from 'react'
import { AxiosError, AxiosResponse } from 'axios'
import { NextPage } from 'next'
import { Img } from 'react-image'
import Link from 'next/link'
import stringToColor from 'string-to-color'

// Local files
import { fetchAllFeeds, fetchFeaturedEntryByTitleId, fetchTrendingTags } from '@/services/api'
import { API_URL } from '@/../config/constants'
import { PageHelmet } from '@/components/global/PageHelmet'
import { AdditionalBlock } from '@/components/pages/feeds/AdditionalBlock'
import { TrendingTagsResponseData } from '@/@types/api'
import { FeedList } from '@/@types/pages/feeds'
import { getFeedsPageInitialValues } from '@/services/initializations'
import { FeedsPageInitials } from '@/@types/initializations'
import { AppLayout } from '@/layouts/AppLayout'
import { ArticleListContent } from '@/components/pages/feeds/ArticleListContent'
import { TagSearchingBlock } from '@/components/pages/feeds/TagSearchingBlock'
import { Roles } from '@/enums'
import FlowHeader from '@/components/pages/feeds/FlowHeader'

const Homepage: NextPage<FeedsPageInitials> = (props): JSX.Element => {
	const [trendingTags, setTrendingTags] = useState<TrendingTagsResponseData[]>(props.trendingTags)
	const [tagFilter, setTagFilter] = useState<string>(null)
	const [feedList, setFeed] = useState<FeedList[]>([])
	const [sortBy, setSortBy] = useState<'hot' | 'top' | undefined>(undefined)
	const [skipValueForPagination, setSkipValueForPagination] = useState(0)
	const [canLoadMore, setCanLoadMore] = useState(null)
	const [isJustInitialized, setIsJustInitialized] = useState(true)
	const [isLoading, setIsLoading] = useState(true)
	const [isLoadMoreTriggered, setIsLoadMoreTriggered] = useState(false)

	useEffect(() => {
		handleDataFetching().then(() => setIsJustInitialized(false))
	}, [])

	useEffect(() => {
		if (!isJustInitialized) {
			handleDataFetching()
		}
	}, [skipValueForPagination, tagFilter, sortBy, isLoading])

	const handleFlowReset = (): void => {
		setIsLoading(true)
		setFeed([])
		setSkipValueForPagination(0)
	}

	const handleSorting = (sortBy: 'hot' | 'top' | undefined): void => {
		handleFlowReset()
		setSortBy(sortBy)
	}

	const handleFilteringTags = (tag: string): void => {
		if (tagFilter) {
			if (tagFilter.split(',').includes(tag) === false) {
				handleFlowReset()
				setTagFilter(`${tagFilter},${tag}`)
			}
		}

		else {
			handleFlowReset()
			setTagFilter(tag)
		}
	}

	const handleDataFetching = async (): Promise<void> => {
		if (!trendingTags) {
			fetchTrendingTags()
				.then(res => setTrendingTags(res.data.attributes.tags))
		}

		await fetchAllFeeds(skipValueForPagination, undefined, tagFilter, sortBy)
			.then(async (feedsResponse: AxiosResponse) => {
				const promises = await feedsResponse.data.attributes.titles.map(async (title: any) => {
					const featuredEntry: any = await fetchFeaturedEntryByTitleId(title.id).then(featuredEntryResponse => featuredEntryResponse.data.attributes)
						.catch(_error => { })

					const feed = {
						id: title.id,
						slug: title.slug,
						name: title.name,
						href: `/${title.slug}`,
						tags: title.tags,
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
				result.map((item: FeedList) => {
					if (feedList.find(i => i.id === item.id)) return
					setFeed((feedList: FeedList[]) => [...feedList, item])
				})

				if (feedsResponse.data.attributes.count > (feedsResponse.data.attributes.titles.length + skipValueForPagination)) setCanLoadMore(true)
				else setCanLoadMore(false)
			})
			.catch((error: AxiosError) => message.error(error.response?.data.message))
		setIsLoading(false)
		setIsLoadMoreTriggered(false)
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
				loading={{
					spinning: isLoading,
					indicator: <LoadingOutlined />,
					style: {
						color: '#212121',
						fontSize: 20,
						fontWeight: 'lighter'
					}
				}}
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
										<Link href={'/[feed]'} as={item.href}>
											<a style={{ cursor: 'pointer' }} >
												<h3>
													{item.name}
												</h3>
											</a>
										</Link>
									</Col>
								</Row>
							}
							avatar={
								<Img
									width={100}
									loader={<Skeleton.Avatar size={100} shape="square" active />}
									src={`${API_URL}/v1/title/${item.id}/image`}
									alt="Title Image"
								/>
							}
							description={
								item.tags.map(tag => {
									return (
										<div key={tag} className={'custom-tag'} style={{ backgroundColor: stringToColor(tag) }}>
											<Typography.Text style={{ color: (parseInt(stringToColor(tag).replace('#', ''), 16) > 0xffffff / 2) ? '#000' : '#fff', background: (parseInt(stringToColor(tag).replace('#', ''), 16) > 0xffffff / 2) ? '#fff' : '#000', opacity: 0.9 }}>
												#{tag}
											</Typography.Text>
										</div>
									)
								})
							}
						/>
						{item.featuredEntry ?
							<ArticleListContent data={item.featuredEntry} />
							:
							<Typography.Text strong> No entry posted yet </Typography.Text>
						}
					</List.Item>
				)}
			/>
		)
	}

	const handleTrendingTagsRender = (): JSX.Element => {
		if (!trendingTags) {
			return (
				<div style={{ textAlign: 'center' }}>
					<LoadingOutlined spin style={{ fontSize: 25 }} />
				</div>
			)
		}

		return (
			<div>
				{trendingTags.map(tag => {
					return (
						<div key={tag._id} onClick={() => handleFilteringTags(tag.name)} className={'custom-tag'} style={{ backgroundColor: stringToColor(tag.name), cursor: 'pointer' }}>
							<Typography.Text style={{ color: (parseInt(stringToColor(tag.name).replace('#', ''), 16) > 0xffffff / 2) ? '#000' : '#fff', background: (parseInt(stringToColor(tag.name).replace('#', ''), 16) > 0xffffff / 2) ? '#fff' : '#000', opacity: 0.9 }}>
								#{tag.name}
							</Typography.Text>
						</div>
					)
				})}
			</div>
		)
	}

	const handleFetchMore = (): void => {
		setIsLoadMoreTriggered(true)
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
				{isLoadMoreTriggered ? <LoadingOutlined /> : 'More'}
			</Button>
		</div>
	)

	return (
		<AppLayout authority={Roles.Guest}>
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
							setSortBy={(val: 'top' | 'hot' | undefined): void => handleSorting(val)}
							resetTagFilter={(): void => setTagFilter(null)}
							beforeFilterReset={() => handleFlowReset()}
							sortBy={sortBy}
						/>
						{handleFeedListView()}
					</Card>
				</Col>
				<Col xl={8} lg={10} md={24} sm={24} xs={24} style={{ padding: 4 }}>
					<Card className="blockEdges" style={{ marginBottom: 5 }} bordered={false}>
						<Typography.Title level={4} style={{ fontWeight: 'normal' }}> Trending Tags </Typography.Title>
						{handleTrendingTagsRender()}
					</Card>
					<TagSearchingBlock
						tagFilter={tagFilter ? tagFilter.split(',') : []}
						setTagFilter={handleFilteringTags}
						beforeTagDeSelect={() => handleFlowReset()}
						updateTagFilterList={setTagFilter}
					/>
					<AdditionalBlock />
				</Col>
			</Row>
			<br/>
		</AppLayout>
	)
}

Homepage.getInitialProps = async () => getFeedsPageInitialValues()

export default Homepage