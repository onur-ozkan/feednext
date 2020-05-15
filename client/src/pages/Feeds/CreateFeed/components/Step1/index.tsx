// Antd dependencies
import { Form, Button, Input } from 'antd'

// Other dependencies
import React, { useContext } from 'react'

// Local files
import ImageUpload from '@/components/ImageUpload'
import StepContext from '../../StepContext'
import styles from './index.less'
import { CategorySelect } from '@/components/CategorySelect'

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
	const { createTitleFormData, readableCategoryValue } = useContext(StepContext)
	const { setCreateTitleFormData, stepMovementTo, setReadableCategoryValue } = props

	const onValidateForm = (): void => {
		if (!form.getFieldValue('categoryId') && !form.getFieldValue('title')) return
		setCreateTitleFormData({
			...createTitleFormData,
			name: form.getFieldValue('title'),
			categoryId: form.getFieldValue('categoryId'),
		})
		stepMovementTo('create-entry')
	}

	const handleReadableCategoryValue = (_id: string | string[], title: React.ReactNode[]): void => {
		setReadableCategoryValue(title[0])
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
		<Form
			{...formItemLayout}
			form={form}
			initialValues={{ categoryId: createTitleFormData.categoryId, title: createTitleFormData.name }}
			layout="horizontal"
			className={styles.stepForm}
		>
			<Form.Item label="Title Image" rules={[{ required: false }]}>
				<ImageUpload
					defaultUrl={createTitleFormData.imageBase64}
					onImageTake={handleOnUpload}
					onRemoveImage={handleOnPictureDelete}
				/>
			</Form.Item>
			<Form.Item
				label="Category"
				name="categoryId"
				rules={[{ required: true, message: 'Please select category' }]}
			>
				<CategorySelect
					defaultValue={readableCategoryValue}
					placeHolder="Electronic"
					onSelect={handleReadableCategoryValue}
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
