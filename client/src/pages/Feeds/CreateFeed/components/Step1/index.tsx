import React, { useContext, useState } from 'react'
import { Form, Button, Input, TreeSelect, Upload, message } from 'antd'
import styles from './index.less'
import StepContext from '../../StepContext'
import { LoadingOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons'
import ImageUpload from '@/components/ImageUpload'

const formItemLayout = {
	labelCol: {
		span: 7,
	},
	wrapperCol: {
		span: 17,
	},
}

const Step1: React.FC = (props: any) => {
	const [form] = Form.useForm()
	const { createTitleFormData } = useContext(StepContext)
	const { categories, setCreateTitleFormData, stepMovementTo, setReadableCategoryValue } = props

	const onValidateForm = (): void => {
		if (!form.getFieldValue('categoryId') && !form.getFieldValue('title')) return
		setCreateTitleFormData({
			...createTitleFormData,
			name: form.getFieldValue('title'),
			categoryId: form.getFieldValue('categoryId'),
		})
		stepMovementTo('create-entry')
	}

	const handleReadableCategoryValue = (id, title): void => setReadableCategoryValue(title[0])


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
		<Form
			{...formItemLayout}
			form={form}
			initialValues={{ categoryId: createTitleFormData.categoryId, title: createTitleFormData.name }}
			layout="horizontal"
			className={styles.stepForm}
		>
			<Form.Item label="Title Image" rules={[{ required: false }]}>
				<ImageUpload
					onImageTake={handleOnUpload}
					onRemoveImage={handleOnPictureDelete}
				/>
			</Form.Item>
			<Form.Item
				label="Category"
				name="categoryId"
				rules={[{ required: true, message: 'Please select category' }]}
			>
				<TreeSelect
					placeholder="Electronic"
					treeData={categories}
					onChange={handleReadableCategoryValue}
					allowClear
				/>
			</Form.Item>
			<Form.Item label="Title" name="title" rules={[{ required: true, message: 'Please fill the title input' }]}>
				<Input placeholder="Xphone Model 7s Plus" />
			</Form.Item>
			<Form.Item
				wrapperCol={{
					xs: { span: 24, offset: 0 },
					sm: {
						span: formItemLayout.wrapperCol.span,
						offset: formItemLayout.labelCol.span,
					},
				}}
			>
				<Button type="primary" htmlType="submit" onClick={onValidateForm}>
					Next
				</Button>
			</Form.Item>
		</Form>
	)
}

export default Step1
