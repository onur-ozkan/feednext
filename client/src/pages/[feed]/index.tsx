// Antd dependencies
import { Modal, Form, Input, Button, Popconfirm, message, Select, Typography } from 'antd'
import { InfoCircleOutlined } from '@ant-design/icons'

// Other dependencies
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useRouter, NextRouter } from 'next/router'
import { NextPage } from 'next'

// Local files
import { fetchEntriesByTitleId, getAverageTitleRate, updateTitle, deleteTitleImage, updateTitleImage, searchTagByName } from '@/services/api'
import { TitleResponseData } from '@/@types/api'
import { API_URL } from '@/../config/constants'
import { PageHelmet } from '@/components/global/PageHelmet'
import { EntryAttributes } from '@/@types/pages'
import { getFeedPageInitialValues } from '@/services/initializations'
import { FeedPageInitials } from '@/@types/initializations'
import { ImageUpload } from '@/components/global/ImageUpload'
import { AppLayout } from '@/layouts/AppLayout'
import { Roles } from '@/enums'
import NotFoundPage from '@/pages/404'
import FeedHeader from '@/components/pages/[feed]/FeedHeader'
import FeedEntries from '@/components/pages/[feed]/FeedEntries'
import PageLoading from '@/components/global/PageLoading'

const Feed: NextPage<FeedPageInitials> = (props): JSX.Element => {
	const router: NextRouter & { query: { page?: number } } = useRouter()
	const globalState = useSelector((state: any) => state.global)
	const userRole = useSelector((state: any) => state.user?.attributes.user.role)

	const [title, setTitle] = useState<TitleResponseData>(props.titleData)
	const [featuredEntry, setFeaturedEntry] = useState<string>(props.featuredEntry)
	const [keywords, setKeywords] = useState(props.keywords)
	const [averageTitleRate, setAverageTitleRate] = useState<number | null>(props.averageTitleRate)
	const [entryList, setEntryList] = useState<{
		entries: EntryAttributes[],
		count: number
	}| null>(props.entryList)
	const [sortEntriesBy, setSortEntriesBy] = useState<'newest' | 'top' | null>(null)
	const [updateModalVisibility, setUpdateModalVisibility] = useState(false)
	const [titleImageBlob, setTitleImageBlob] = useState<Blob | null>(null)
	const [titleNotFound, setTitleNotFound] = useState(props.error)

	const [tagResult, setTagResult] = useState([])
	const [noTagDataMessage, setNoTagDataMessage] = useState('Enter at least 3 characters to search')
	const [tagValue, setTagValue] = useState(title.attributes.tags)

	const [form] = Form.useForm()

	useEffect(() => {
		if (title) handleEntryFetching(10 * (Number(router.query.page) - 1) || 0)
	}, [title, sortEntriesBy])

	const handleEntryFetching = (page: number): void => {
		fetchEntriesByTitleId(title.attributes.id, page, sortEntriesBy).then(async ({ data }) => setEntryList(data.attributes))
	}

	const handleTagSearching = (value: string): void => {
		if (value.length < 3) {
			setTagResult([])
			setNoTagDataMessage('Enter at least 3 characters to search')
		}

		else {
			searchTagByName(value).then(({ data }) => {
				const result = []
				data.attributes.tags.map(tag => {
					result.push(<Select.Option key={tag._id} value={tag.name}>{tag.name}</Select.Option>)
				})

				if (result.length !== 0) setTagResult(result)
				else setTagResult([<Select.Option key={value} value={value}>{value}</Select.Option>])
			})
		}
	}

	const handleTagSelect = (value: string): void => {
		setTagValue([...tagValue, value])
	}

	const handleDeSelect = (tag: string) => {
		const updatedList = tagValue.filter(value => value !== tag)
		setTagValue(updatedList)
	}

	const getTitleRate = async (titleId: string): Promise<void> => {
		await getAverageTitleRate(titleId).then(res => setAverageTitleRate(res.data.attributes.rate || 0))
	}

	const handleTitleUpdate = async (values: { name: string }): Promise<void> => {
		const updatePayload = {
			name: values.name,
			tags: tagValue,
		}

		if (!titleImageBlob) {
			deleteTitleImage(globalState.accessToken, title.attributes.id)
				.catch(error => message.error(error.response.data.message))
		}

		else if (titleImageBlob) {
			const formData = new FormData()
			formData.append('image', titleImageBlob)

			updateTitleImage(globalState.accessToken, title.attributes.id, formData)
				.catch(error => message.error(error.response.data.message))
		}

		await updateTitle(globalState.accessToken, title.attributes.id, updatePayload)
			.then((_res: { data: { attributes: { slug: any } } }) => {
				router.push('/[feed]', `/${_res.data.attributes.slug}`)
			})
			.catch((error: any) => message.error(error.response.data.message))
	}

	if (titleNotFound) return <NotFoundPage />
	if (!entryList || !title || (!averageTitleRate && averageTitleRate !== 0)) return <PageLoading />

	return (
		<AppLayout authority={Roles.Guest}>
			<PageHelmet
				title={title.attributes.name}
				description={`Best reviews, comments, feedbacks about ${title.attributes.name} around the world`}
				author={title.attributes.opened_by}
				keywords={keywords}
				mediaTitle={title.attributes.name}
				mediaDescription={featuredEntry}
				mediaImage={`${API_URL}/v1/title/${title.attributes.id}/image`}
			/>
			<FeedHeader
				accessToken={globalState.accessToken}
				openUpdateModal={(): void => setUpdateModalVisibility(true)}
				userRole={userRole}
				titleData={title}
				averageTitleRate={averageTitleRate}
				refreshTitleRate={getTitleRate}
			/>
			<FeedEntries
				defaultPage={router.query.page}
				sortEntriesBy={sortEntriesBy}
				setSortEntriesBy={setSortEntriesBy}
				setEntryList={setEntryList}
				accessToken={globalState.accessToken}
				handleEntryFetching={handleEntryFetching}
				entryList={entryList}
				titleData={title}
			/>
			<Modal
				transitionName='fade'
				centered
				visible={updateModalVisibility}
				closable={false}
				width='300px'
				footer={null}
				onCancel={(): void => setUpdateModalVisibility(false)}
			>
				<Form
					onFinish={handleTitleUpdate}
					form={form}
					initialValues={{ name: title.attributes.name }}>
					<div
						style={{
							marginBottom: 10,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center'
						}}
					>
						<div>
							<ImageUpload
								defaultUrl={`${API_URL}/v1/title/${title.attributes.id}/image`}
								onImageTake={(_base64: any, blob: React.SetStateAction<Blob | null>): void => setTitleImageBlob(blob)}
								onRemoveImage={(): void => setTitleImageBlob(null)}
							/>
						</div>
					</div>
					<Form.Item style={{ marginBottom: 10 }}>
						<Select
							mode="multiple"
							defaultValue={title.attributes.tags}
							style={{ width: '100%' }}
							placeholder="please specify feed-related keywords"
							onSearch={handleTagSearching}
							onSelect={handleTagSelect}
							onDeselect={handleDeSelect}
							notFoundContent={
								<Typography.Text style={{ width: '100%' }}> {noTagDataMessage} </Typography.Text>
							}
						>
							{tagResult}
						</Select>
					</Form.Item>
					<Form.Item
						name="name"
						style={{ marginBottom: 10 }}
						rules={[{ required: true, message: 'Please fill the input above' }]}
					>
						<Input maxLength={60} placeholder="Title Name" />
					</Form.Item>
					<div style={{ textAlign: 'center' }}>
						<Popconfirm
							placement="bottom"
							style={{ fontSize: 15 }}
							icon={<InfoCircleOutlined style={{ color: 'red' }} />}
							title="Are you sure that you want to update this feed?"
							onConfirm={(): void => form.submit()}
							okText="Yes"
							cancelText="No"
						>
							<Button style={{ width: '100%' }} type="primary">
								OK
							</Button>
						</Popconfirm>
					</div>
				</Form>
			</Modal>
			<br/>
		</AppLayout>
	)
}

Feed.getInitialProps = async (context: any) => await getFeedPageInitialValues(context.query.feed, context.query.page)

export default Feed
