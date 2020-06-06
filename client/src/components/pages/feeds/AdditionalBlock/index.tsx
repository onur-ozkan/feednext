// Antd dependencies
import { Card, Row, Typography, Col, Divider } from 'antd'

// Other dependencies
import React, { useState } from 'react'

// Local files
import { Aggrements } from '@/components/global/Aggrements'
import packageJson from '@/../package.json'

export const AdditionalBlock = (): JSX.Element => {
	const [aggrementModalVisibility, setAggrementModalVisibilit] = useState<null | 'policy' | 'terms'>(null)

	return (
		<Card>
			<Aggrements
				aggrementModalVisibility={aggrementModalVisibility}
				closeAggrementWindow={(): void => setAggrementModalVisibilit(null)}
			/>
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
				<Col span={12}>
					<span style={{ cursor: 'pointer' }} onClick={(): void => setAggrementModalVisibilit('policy')}>
						<Typography.Text strong>
							Privacy Policy
						</Typography.Text>
					</span>
				</Col>
				<Col span={12}>
					<span style={{ cursor: 'pointer' }} onClick={(): void => setAggrementModalVisibilit('terms')}>
						<Typography.Text strong>
							Terms & Conditions
						</Typography.Text>
					</span>
				</Col>
			</Row>
			<Row>
				<Typography.Text>
					Feednext © 2020. All rights reserved
				</Typography.Text>
				<Divider style={{ marginBottom: -15 }} orientation="right">
					<Typography.Text style={{ fontSize: 13, opacity: 0.65, color: '#016d9b' }}>
						v{packageJson.version}
					</Typography.Text>
				</Divider>
			</Row>
		</Card>
	)
}
