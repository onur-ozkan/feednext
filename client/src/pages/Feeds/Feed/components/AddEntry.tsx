import React, { useState } from 'react'
import { Button, Input, Form, Card, message, Typography } from 'antd'
import { createEntry } from '@/services/api'

const AddEntry: React.FC = ({ titleId, accessToken, setEntryList }) => {
	const [submitting, setSubmitting] = useState(false)
	const [form] = Form.useForm();

	const handleEntryPost = ({ entry }: { entry: string}) => {
		setSubmitting(true)
		createEntry({
			titleId,
			text: entry,
		}, accessToken)
		.then(res => {
			setEntryList((state): any => ({
				...state,
				entries: [...state.entries, res.data.attributes]
			}))
			setSubmitting(false)
			message.success('You have been published a entry')
			form.resetFields()
		})
		.catch(error => {
			setSubmitting(false)
			message.error(error.response.data.message)
		})
	}

	return (
		<Card bordered={false}>
			<Form form={form} onFinish={handleEntryPost}>
				<Form.Item name="entry">
					<Input.TextArea placeholder="Start feeding!" rows={4} />
				</Form.Item>
				<Form.Item>
					<Button htmlType="submit" loading={submitting} type="primary">
						<Typography.Text style={{ color: 'white' }} strong>
							Add Entry
						</Typography.Text>
					</Button>
				</Form.Item>
			</Form>
		</Card>
	)
}

export default AddEntry
