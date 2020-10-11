// Antd dependencies
import { Form, Button, Descriptions, Divider, Modal, Avatar, Rate, Typography } from 'antd'
import { ExclamationCircleOutlined, LoadingOutlined } from '@ant-design/icons'
import TextArea from 'antd/lib/input/TextArea'

// Other dependencies
import React, { useContext, useState } from 'react'
import stringToColor from 'string-to-color'

// Local files
import { PageHelmet } from '@/components/global/PageHelmet'
import { StepContext } from '@/services/step.context.service'
import { Step2Props } from '@/@types/pages'
import '../style.less'

const formItemLayout = {
	labelCol: {
		span: 5,
	},
	wrapperCol: {
		span: 19,
	},
}

const Step2 = (props: Step2Props): JSX.Element => {
	const [form] = Form.useForm()
	const { createTitleFormData, readableTagValue, firstEntryForm, titleRate } = useContext(StepContext)
	const { stepMovementTo, setFirstEntryForm, setIsRequestReady, setTitleRate } = props
	const [isRequestStarted, setIsRequestStarted] = useState(false)

	const onPrev = (): void => {
		setFirstEntryForm((state: any) => ({...state, text: form.getFieldValue('entry') }))
		setTitleRate(form.getFieldValue('rate'))
		stepMovementTo('main')
	}

	const onValidateForm = (): void => {
		setIsRequestStarted(true)
		if (!form.getFieldValue('entry') || !form.getFieldValue('rate')) {
			setIsRequestStarted(false)
			return
		}

		setFirstEntryForm({
			text: form.getFieldValue('entry')
		})
		setTitleRate(form.getFieldValue('rate'))
		setIsRequestReady(true)
	}

	const confirmationModal = (): void => {
		if (!form.getFieldValue('entry') || !form.getFieldValue('rate')) return
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
		<>
			<PageHelmet
				title="Enter First Entry"
				description="Best reviews, comments, feedbacks about anything around the world"
				mediaImage="https://avatars1.githubusercontent.com/u/64217221?s=200&v=4"
				mediaDescription="Best reviews, comments, feedbacks about anything around the world"
			/>
			<Form {...formItemLayout} form={form} initialValues={{ entry: firstEntryForm.text }} layout="horizontal" className={'stepForm'}>
				<Descriptions column={1}>
					<Descriptions.Item label="Title Image">
						<Avatar
							src={createTitleFormData.imageBase64}
							size="large"
							shape="square"
							alt="Title Image"
						/>
					</Descriptions.Item>
					<Descriptions.Item label="Tags">
						{readableTagValue.map(tag => {
							return (
								<div key={tag} className={'custom-tag'} style={{ backgroundColor: stringToColor(tag) }}>
									<Typography.Text style={{ color: (parseInt(stringToColor(tag).replace('#', ''), 16) > 0xffffff / 2) ? '#000' : '#fff', background: (parseInt(stringToColor(tag).replace('#', ''), 16) > 0xffffff / 2) ? '#fff' : '#000', opacity: 0.9 }}>
										#{tag}
									</Typography.Text>
								</div>
							)
						})}
					</Descriptions.Item>
					<Descriptions.Item label="Title">
						{ createTitleFormData.name }
					</Descriptions.Item>
				</Descriptions>
				<Divider style={{ margin: '24px 0' }} />
				<Form.Item label="Rate" name="rate" rules={[{ required: true, message: 'Please rate the title' }]}>
					<Rate defaultValue={titleRate} />
				</Form.Item>
				<Form.Item rules={[{ required: true, message: 'Please fill the input above' }]} label="Entry" name="entry">
					<TextArea
						placeholder="Share us your thoughts about the title that you are creating"
						autoSize={{ minRows: 4 }}
					/>
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
					<Button
						type="primary"
						htmlType="submit"
						icon={isRequestStarted && <LoadingOutlined />}
						onClick={!isRequestStarted && confirmationModal}
					>
						Post
					</Button>
					<Button onClick={!isRequestStarted && onPrev} style={{ marginLeft: 8 }}>
						Previous Step
					</Button>
				</Form.Item>
				{confirmationModal}
			</Form>
		</>
	)
}
export default Step2
