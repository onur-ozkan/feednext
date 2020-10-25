// Antd dependencies
import { Card, Row, Typography, Col, Divider } from 'antd'

// Other dependencies
import React, { useState } from 'react'
import Link from 'next/link'

// Local files
import { Aggrements } from '@/components/global/Aggrements'
import packageJson from '@/../package.json'

export const AdditionalBlock = (): JSX.Element => {
	const [aggrementModalVisibility, setAggrementModalVisibilit] = useState<null | 'policy' | 'terms'>(null)

	return (
		<Card className="blockEdges" bordered={false}>
			<Aggrements
				aggrementModalVisibility={aggrementModalVisibility}
				closeAggrementWindow={(): void => setAggrementModalVisibilit(null)}
			/>
			<Row style={{ marginBottom: 15 }}>
				<Col span={12}>
					<a>
						<Link href="/help">
							<Typography.Text strong>
								Help
							</Typography.Text>
						</Link>
					</a>
				</Col>
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
				<Divider style={{ marginBottom: -15, marginTop: 3, color: 'red' }} plain orientation="right">
					<Typography.Text style={{ fontSize: 13, color: '#6ec49a' }}>
						v{packageJson.version}
					</Typography.Text>
				</Divider>
			</Row>
		</Card>
	)
}
