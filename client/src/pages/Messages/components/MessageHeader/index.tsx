// Antd dependencies
import { Row, Typography, Popconfirm, Col, Button } from 'antd'
import { WarningOutlined, DeleteFilled } from '@ant-design/icons'

// Other dependencies
import React from 'react'


export const MessageHeader = (params): JSX.Element => {
	return (
		<Row>
			<Col>
				<Typography.Text style={{ fontSize: 25, marginLeft: 50 }}> {params.title} </Typography.Text>
			</Col>
			<Popconfirm
				placement="leftBottom"
				style={{ fontSize: 15 }}
				icon={<WarningOutlined style={{ color: 'red' }} />}
				title="Are you sure to delete this conversation?"
				onConfirm={params.onDelete}
				okText="Yes"
				cancelText="No"
			>
				<Button
					style={{ marginRight: 20 }}
					shape="circle"
					danger
					icon={<DeleteFilled />}
				/>
			</Popconfirm>
		</Row>
	)
}
