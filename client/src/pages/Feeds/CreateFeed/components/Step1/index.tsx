import React from 'react'
import { Form, Button, Divider, Input, Select, Row } from 'antd'
import { Dispatch } from 'redux'
import { connect } from 'dva'
import { StateType } from '../../model'
import styles from './index.less'
import TextArea from 'antd/lib/input/TextArea'

const { Option } = Select

const formItemLayout = {
	labelCol: {
		span: 5,
	},
	wrapperCol: {
		span: 19,
	},
}
declare interface Step1Props {
	data?: StateType['step']
	dispatch?: Dispatch<any>
}

const Step1: React.FC<Step1Props> = props => {
	const { dispatch, data } = props
	const [form] = Form.useForm()

	if (!data) {
		return null
	}
	const { validateFields } = form
	const onValidateForm = async () => {
		if (!form.getFieldValue('category') && !form.getFieldValue('title')) return

		const values = await validateFields()
		if (dispatch) {
			dispatch({
				type: 'feedsAndCreateFeed/saveStepFormData',
				payload: values,
			})
			dispatch({
				type: 'feedsAndCreateFeed/saveCurrentStep',
				payload: 'confirm',
			})
		}
	}
	return (
		<>
			<Form {...formItemLayout} form={form} layout="horizontal" className={styles.stepForm}>
				<Form.Item
					label="Category"
					name="category"
					rules={[{ required: true, message: 'Please fill the input above' }]}
				>
					<Select mode="tags" placeholder="Phone">
						<Option value="alipay">Alipay</Option>
						<Option value="bank">Bank</Option>
					</Select>
				</Form.Item>
				<Form.Item label="Title" name="title" rules={[{ required: true, message: 'Please fill the input above' }]}>
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
						You have to make sure the category of your feed pointed correctly. If the category doesnt exist, you
						can create a new one by typing a new value in input field.
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

export default connect(({ feedsAndCreateFeed }: { feedsAndCreateFeed: StateType }) => ({
	data: feedsAndCreateFeed.step,
}))(Step1)
