// Antd dependencies
import { TreeSelect, Modal, Form, Input, Button, Popconfirm, message } from 'antd'
import { InfoCircleOutlined } from '@ant-design/icons'

// Other dependencies
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

// Local files
import {
	fetchEntriesByTitleId,
	fetchTitle,
	getAverageTitleRate,
	updateTitle,
	deleteTitleImage,
	updateTitleImage
} from '@/services/api'
import { handleArrayFiltering } from '@/services/utils'
import { API_URL } from '@/../config/constants'
import FeedHeader from './components/FeedHeader'
import FeedEntries from './components/FeedEntries'
import PageLoading from '@/components/PageLoading'
import ImageUpload from '@/components/ImageUpload'
import styles from './style.less'

const Feed: React.FC = ({ computedMatch }): JSX.Element => {
	const globalState = useSelector((state: any) => state.global)
	const userRole = useSelector((state: any) => state.user?.attributes.user.role)

	const [form] = Form.useForm()

	const [title, setTitle]: any = useState(null)
	const [averageTitleRate, setAverageTitleRate] = useState(null)
	const [category, setCategory]: any = useState(null)
	const [sortEntriesBy, setSortEntriesBy] = useState(null)
	const [entryList, setEntryList]: any = useState(null)
	const [updateModalVisibility, setUpdateModalVisibility] = useState(false)

	const [titleImageBlob, setTitleImageBlob] = useState(null)

	const handleEntryFetching = (page: number): void => {
		fetchEntriesByTitleId(title.attributes.id, page, sortEntriesBy).then(res => {
			setEntryList(res.data.attributes)
		})
	}

	useEffect(() => {
		if (title) handleEntryFetching(0)
	}, [title, sortEntriesBy])

	const getTitleRate = async (titleId: string): Promise<void> => {
		await getAverageTitleRate(titleId).then(res => setAverageTitleRate(res.data.attributes.rate || 0))
	}

	const handleTitleUpdate = async (values: { categoryId: string, name: string }): Promise<void> => {
		if (titleImageBlob === false) {
			deleteTitleImage(globalState.accessToken, title.attributes.id)
				.catch(error => message.error(error.response.data.message))
		}

		else if (titleImageBlob) {
			const formData = new FormData()
			formData.append('image', titleImageBlob)

			updateTitleImage(globalState.accessToken, title.attributes.id, formData)
				.catch(error => message.error(error.response.data.message))
		}

		await updateTitle(globalState.accessToken, title.attributes.id, values)
			.then(_res => {
				location.href = `/feeds/${_res.data.attributes.slug}`
			})
			.catch(error => message.error(error.response.data.message))
	}

	useEffect(() => {
		fetchTitle(computedMatch.params.feedSlug, 'slug').then(async res => {
			setCategory(handleArrayFiltering(globalState.categoryList, res.data.attributes.category_id))
			getTitleRate(res.data.attributes.id)
			await setTitle(res.data)
		})
	}, [])

	if (!entryList || !title || !category || (!averageTitleRate && averageTitleRate !== 0)) return <PageLoading />

	return (
		<>
			<FeedHeader
				accessToken={globalState.accessToken}
				styles={styles}
				openUpdateModal={(): void => setUpdateModalVisibility(true)}
				userRole={userRole}
				titleData={title}
				categoryData={category}
				averageTitleRate={averageTitleRate}
				refreshTitleRate={getTitleRate}
			/>
			<FeedEntries
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
					initialValues={{
						name: title.attributes.name,
						categoryId: category.id
					}}
				>
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
								onImageTake={(_base64, blob): void => setTitleImageBlob(blob)}
								onRemoveImage={(): void => setTitleImageBlob(false)}
							/>
						</div>
					</div>
					<Form.Item
						name="categoryId"
						style={{ marginBottom: 10 }}
						rules={[{ required: true, message: 'Please select category' }]}
					>
						<TreeSelect treeData={globalState.categoryTree} style={{ width: '100%' }} placeholder="Electronic" allowClear />
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
		</>
	)
}

export default Feed
