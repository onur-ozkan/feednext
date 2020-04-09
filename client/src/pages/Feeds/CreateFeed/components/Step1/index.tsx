import React, { useContext } from 'react'
import { Form, Button, Divider, Input, Row, TreeSelect } from 'antd'
import styles from './index.less'
import TextArea from 'antd/lib/input/TextArea'
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
			description: form.getFieldValue('description')
		})
		stepMovementTo('create-entry')
	}

	const handleReadableCategoryValue = (id, title) => {
		setReadableCategoryValue(title[0])
	}

	return (
		<>
			<Form {...formItemLayout} initialValues={{ categoryId: createTitleForm.categoryId, title: createTitleForm.name, description: createTitleForm.description }} form={form} layout="horizontal" className={styles.stepForm}>
				<Form.Item
					label="Category"
					name="categoryId"
					rules={[{ required: true, message: 'Please select category' }]}
				>
					<TreeSelect placeholder="Electronic" onChange={handleReadableCategoryValue} allowClear>
						{categories.map((data: any) => (
							<TreeSelect.TreeNode key={data.id} value={data.id} title={data.name}>
								{data.childNodes.map((child: any) => (
									<TreeSelect.TreeNode key={child.id} value={child.id} title={child.name} />
								))}
							</TreeSelect.TreeNode>
						))}
					</TreeSelect>
				</Form.Item>
				<Form.Item label="Title" name="title" rules={[{ required: true, message: 'Please fill the title input' }]}>
					<Input placeholder="Xphone Model 7s Plus" />
				</Form.Item>
				<Form.Item label="Description" name="description">
					<TextArea
						placeholder="Xphone Model 7s Plus is a phone released at 2014, here is the device you can check better https://example.com/xphone-model-7s-plus"
						allowClear
						autoSize={{ minRows: 4 }}
					/>
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
			<Divider style={{ margin: '40px 0 24px' }} />
			<div className={styles.desc}>
				<h3 style={{ fontWeight: 'bold' }}>FORM GUIDE</h3>
				<Row style={{ alignItems: 'center' }}>
					<h3 style={{ marginRight: 10, fontWeight: 'bold' }}>Category</h3>
					<p>
						You have to make sure the category of your feed pointed correctly. If the category that you looking for doesnt exist,
						please select 'Other' and tell us the category name in the description box so we can add it to application.
					</p>
				</Row>
				<Row style={{ alignItems: 'center' }}>
					<h3 style={{ marginRight: 10, fontWeight: 'bold' }}>Title</h3>
					<p>You have to make sure the title of your feed represents a visible material.</p>
				</Row>
				<Row style={{ alignItems: 'center' }}>
					<h3 style={{ marginRight: 10, fontWeight: 'bold' }}>Description</h3>
					<p>
						This is not a required field for known, popular materials. But for some materials, this field may
						help to increase approvement of the feed.
					</p>
				</Row>
			</div>
		</>
	)
}

export default Step1
