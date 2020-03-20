import React from 'react'
import { Form, Button, Descriptions, Divider, Modal } from 'antd'
import { Dispatch } from 'redux'
import { connect } from 'dva'
import { StateType } from '../../model'
import styles from './index.less'
import TextArea from 'antd/lib/input/TextArea'
import { ExclamationCircleOutlined } from '@ant-design/icons'

const formItemLayout = {
	labelCol: {
		span: 5,
	},
	wrapperCol: {
		span: 19,
	},
}
interface Step2Props {
	data?: StateType['step']
	dispatch?: Dispatch<any>
	submitting?: boolean
}

const Step2: React.FC<Step2Props> = props => {
	const [form] = Form.useForm()
	const { data, dispatch, submitting } = props
	if (!data) {
		return null
	}
	const { validateFields, getFieldsValue } = form
	const onPrev = () => {
		if (dispatch) {
			const values = getFieldsValue()
			dispatch({
				type: 'feedsAndCreateFeed/saveStepFormData',
				payload: {
					...data,
					...values,
				},
			})
			dispatch({
				type: 'feedsAndCreateFeed/saveCurrentStep',
				payload: 'info',
			})
		}
	}
	const onValidateForm = async () => {
		if (!form.getFieldValue('entry')) return
		const values = await validateFields()
		if (dispatch) {
			dispatch({
				type: 'feedsAndCreateFeed/submitStepForm',
				payload: {
					...data,
					...values,
				},
			})
		}
	}

	const confirmationModal = (): void => {
		if (!form.getFieldValue('entry')) return
		Modal.confirm({
			centered: true,
			title: 'You are about to post this feed. Are you sure ?',
			icon: <ExclamationCircleOutlined />,
			okText: 'Yes',
			cancelText: 'No',
			onOk() {
				onValidateForm()
			},
		})
	}

	return (
		<Form {...formItemLayout} form={form} layout="horizontal" className={styles.stepForm}>
			<Descriptions column={1}>
				<Descriptions.Item label="Category"> Phone </Descriptions.Item>
				<Descriptions.Item label="Title"> Xphone Model 7s Plus</Descriptions.Item>
				<Descriptions.Item label="Description">
					{' '}
					Xphone Model 7s Plus is a phone released at 2014, here is the device you can check better
					https://example.com/xphone-model-7s-plus
				</Descriptions.Item>
			</Descriptions>
			<Divider style={{ margin: '24px 0' }} />
			<Form.Item rules={[{ required: true, message: 'Please fill the input above' }]} label="Entry" name="entry">
				<TextArea allowClear autoSize={{ minRows: 4 }} />
			</Form.Item>
			<Form.Item
				style={{ marginBottom: 8 }}
				wrapperCol={{
					xs: { span: 24, offset: 0 },
					sm: {
						span: formItemLayout.wrapperCol.span,
						offset: formItemLayout.labelCol.span,
					},
				}}
			>
				<Button type="primary" htmlType="submit" onClick={confirmationModal} loading={submitting}>
					Post
				</Button>
				<Button onClick={onPrev} style={{ marginLeft: 8 }}>
					Previous Step
				</Button>
			</Form.Item>
			{confirmationModal}
		</Form>
	)
}
export default connect(
	({
		feedsAndCreateFeed,
		loading,
	}: {
		feedsAndCreateFeed: StateType
		loading: {
			effects: { [key: string]: boolean }
		}
	}) => ({
		submitting: loading.effects['feedsAndCreateFeed/submitStepForm'],
		data: feedsAndCreateFeed.step,
	}),
)(Step2)
