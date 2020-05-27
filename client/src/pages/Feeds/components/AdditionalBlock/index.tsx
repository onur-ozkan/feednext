// Antd dependencies
import { Card, Row, Typography, Col } from 'antd'

// Other dependencies
import React from 'react'

export const AdditionalBlock = (): JSX.Element => (
	<Card>
		<Row style={{ marginBottom: 15 }}>
			<Col span={12}>
				<a href="https://github.com/feednext/feednext" target="_api">
					<Typography.Text strong>
						Project Source
					</Typography.Text>
				</a>
			</Col>
			<Col span={12}>
				<a href="https://raw.githubusercontent.com/feednext/feednext/master/COPYING" target="_license">
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
