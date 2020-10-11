// Antd dependencies
import { Form, Button, Input, Select, Typography } from 'antd'

// Other dependencies
import React, { useContext, useState } from 'react'

// Local files
import { PageHelmet } from '@/components/global/PageHelmet'
import { Step1Props } from '@/@types/pages'
import { ImageUpload } from '@/components/global/ImageUpload'
import { ListOfSimilarFeeds } from '@/components/global/ListOfSimilarFeeds'
import { StepContext } from '@/services/step.context.service'
import { searchTagByName } from '@/services/api'
import '../style.less'

const formItemLayout = {
	labelCol: {
		span: 7,
	},
	wrapperCol: {
		span: 17,
	},
}

const Step1: React.FC<Step1Props> = (props): JSX.Element => {
	const [form] = Form.useForm()
	const [tagResult, setTagResult] = useState([])
	const [noTagDataMessage, setNoTagDataMessage] = useState('Enter at least 3 characters to search')
	const [titleValue, setTitleValue] = useState('')
	const { createTitleFormData } = useContext(StepContext)
	const { setCreateTitleFormData, stepMovementTo, setReadableTagValue } = props

	const handleFormValidation = async (): Promise<void> => {
		await form.validateFields()
		setCreateTitleFormData({
			...createTitleFormData,
			name: form.getFieldValue('title')
		})
		stepMovementTo('create-entry')
	}

	const handleReadableTagValue = (tags: string[]): void => {
		setCreateTitleFormData({
			...createTitleFormData,
			tags,
		})
		setReadableTagValue(tags)
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


	const handleOnUpload = (base64Link: string, fileBlob: File): void => {
		setCreateTitleFormData({
			...createTitleFormData,
			imageBase64: base64Link,
			imageFile: fileBlob
		})
	}

	const handleOnPictureDelete = (): void => {
		setCreateTitleFormData({
			...createTitleFormData,
			imageBase64: null,
			imageFile: null
		})
	}

	return (
		<>
			<PageHelmet
				title="Create Title"
				description="Best reviews, comments, feedbacks about anything around the world"
				mediaImage="https://avatars1.githubusercontent.com/u/64217221?s=200&v=4"
				mediaDescription="Best reviews, comments, feedbacks about anything around the world"
			/>
			<Form
				{...formItemLayout}
				form={form}
				initialValues={{ tags: createTitleFormData.tags, title: createTitleFormData.name }}
				layout="horizontal"
				className={'stepForm'}
			>

				<Form.Item label="Image (Optional)" rules={[{ required: false }]}>
					<ImageUpload
						defaultUrl={createTitleFormData.imageBase64}
						onImageTake={handleOnUpload}
						onRemoveImage={handleOnPictureDelete}
					/>
				</Form.Item>

				<Form.Item
					label="Tags"
					name="tags"
					rules={[
						() => ({
							validator() {
								if (!createTitleFormData.tags || createTitleFormData.tags.length < 1) return Promise.reject('Please select atleast one tag')
								return Promise.resolve()
							}
						})
					]}
				>
					<Select
						mode="multiple"
						style={{ width: '100%' }}
						placeholder="please specify feed-related keywords"
						onChange={handleReadableTagValue}
						allowClear
						onSearch={handleTagSearching}
						notFoundContent={
							<Typography.Text style={{ width: '100%' }}> {noTagDataMessage} </Typography.Text>
						}
					>
						{tagResult}
					</Select>
				</Form.Item>

				<Form.Item label="Title" name="title" rules={[{ required: true, message: 'Please fill the title input' }, { min: 3, message: 'Title length must be longer than 2 characters' }]}>
					<Input onChange={(val) => setTitleValue(val.target.value)} placeholder="Xphone Model 7s Plus" />
				</Form.Item>

				<ListOfSimilarFeeds titleValue={titleValue} />

				<Form.Item
					wrapperCol={{
						xs: { span: 24, offset: 0 },
						sm: { span: 17, offset: 7 }
					}}
				>
					<Button type="primary" htmlType="submit" onClick={handleFormValidation}>
						Next
					</Button>
				</Form.Item>

			</Form>
		</>
	)
}

export default Step1
