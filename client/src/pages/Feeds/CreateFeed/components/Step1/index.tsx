import React, { useContext } from 'react'
import { Form, Button, Input, TreeSelect } from 'antd'
import styles from './index.less'
import StepContext from '../../StepContext'

const formItemLayout = {
	labelCol: {
		span: 5,
	},
	wrapperCol: {
		span: 19,
	},
}

const Step1: React.FC = (props: any) => {
	const [form] = Form.useForm()
	const { createTitleForm } = useContext(StepContext)
	const { categories, setCreateTitleForm, stepMovementTo, setReadableCategoryValue } = props

	const onValidateForm = (): void => {
		if (!form.getFieldValue('categoryId') && !form.getFieldValue('title')) return
		setCreateTitleForm({
			name: form.getFieldValue('title'),
			categoryId: form.getFieldValue('categoryId'),
		})
		stepMovementTo('create-entry')
	}

	const handleReadableCategoryValue = (id, title): void => setReadableCategoryValue(title[0])

	return (
		<>
			<Form {...formItemLayout} initialValues={{ categoryId: createTitleForm.categoryId, title: createTitleForm.name }} form={form} layout="horizontal" className={styles.stepForm}>
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
		</>
	)
}

export default Step1
