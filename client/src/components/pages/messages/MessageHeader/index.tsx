// Antd dependencies
import { Row, Typography, Popconfirm, Col, Button } from 'antd'
import { WarningOutlined, DeleteFilled } from '@ant-design/icons'

// Other dependencies
import React from 'react'

// Local files
import { MessageHeaderProps } from '@/@types/pages'

export const MessageHeader: React.FC<MessageHeaderProps> = (props): JSX.Element => {
	return (
		<Row>
			<Col style={{ width: 'calc(100% - 30px)' }}>
				<Typography.Text style={{ fontSize: 25, marginLeft: 50 }}> {props.title} </Typography.Text>
			</Col>
			<Col style={{ width: 30 }}>
				<Popconfirm
					placement="bottomLeft"
					style={{ fontSize: 15 }}
					icon={<WarningOutlined style={{ color: 'red' }} />}
					title="Are you sure to delete this conversation?"
					onConfirm={props.onDelete}
					okText="Yes"
					cancelText="No"
				>
					<Button
						shape="circle"
						danger
						icon={<DeleteFilled />}
					/>
			</Popconfirm>
		</Col>
		</Row>
	)
}
