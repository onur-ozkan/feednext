// Antd dependencies
import { Card, Row, Typography, Col } from 'antd'

// Other dependencies
import React from 'react'
import { Link } from 'umi'

export const AdditionalBlock = (): JSX.Element => (
	<Card>
		<Row style={{ marginBottom: 15 }}>
			<Col span={12}>
				<Link to="/about">
					<Typography.Text strong>
						About
					</Typography.Text>
				</Link>
			</Col>
			<Col span={12}>
				<a href="https://github.com/feednext/feednext#readme" target="_api">
					<Typography.Text strong>
						API
					</Typography.Text>
				</a>
			</Col>
			<Col span={12}>
				<Typography.Text strong>
					Support
				</Typography.Text>
			</Col>
			<Col span={12}>
				<a href="https://github.com/feednext/feednext/blob/master/COPYING" target="_license">
					<Typography.Text strong>
						License
					</Typography.Text>
				</a>
			</Col>
		</Row>
		<Row>
			<Typography.Text>
				Feednext © 2020. All rights reserved
			</Typography.Text>
		</Row>
	</Card>
)
