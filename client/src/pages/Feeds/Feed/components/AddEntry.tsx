import React, { useState } from 'react'
import { Button, Input, Form, Card } from 'antd'

const AddEntry: React.FC = () => {
	const [submitting, setSubmitting] = useState(false)

	const Editor = ({ onChange, onSubmit, submitting }) => (
		<div>
			<Form.Item>
				<Input.TextArea placeholder="Start feeding!" rows={4} onChange={onChange} />
			</Form.Item>
			<Form.Item>
				<Button htmlType="submit" loading={submitting} onClick={onSubmit} type="primary">
					Add Entry
				</Button>
			</Form.Item>
		</div>
	)

	const handleSubmit = (): void => {
		// TODO
	}

	const handleChange = (): void => {
		// TODO
	}

	return (
		<Card bordered={false}>
			<Editor onChange={handleChange} onSubmit={handleSubmit} submitting={submitting} />
		</Card>
	)
}

export default AddEntry
