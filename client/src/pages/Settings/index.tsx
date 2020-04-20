import React, { useEffect, useState } from 'react'
import { Card, Tabs, Typography } from 'antd'
import { UserOutlined, LoadingOutlined } from '@ant-design/icons'

const Settings = (): JSX.Element => {
	const [activeTab, setActiveTab] = useState('profile')
	const [tabView, setTabView] = useState<JSX.Element>(
		<div style={{ textAlign: 'center' }}>
			<LoadingOutlined style={{ fontSize: 20 }} />
		</div>
	)

	useEffect(() => {
		console.log(activeTab)
	}, [activeTab])

	const handleTabChange = (key: string): void => setActiveTab(key)

	return (
		<Card>
			<Tabs size="default" animated={false} defaultActiveKey="profile" onChange={handleTabChange}>
				<Tabs.TabPane
					tab={
						<Typography.Text strong>
							<UserOutlined style={{ margin: 0 }} /> Profile Settings
						</Typography.Text>
					}
					key="profile"
				>
					{tabView}
				</Tabs.TabPane>
				<Tabs.TabPane
					tab={
						<Typography.Text strong>
							<UserOutlined style={{ margin: 0 }} /> Application Settings
						</Typography.Text>
					}
					key="application"
				>
					{tabView}
				</Tabs.TabPane>
			</Tabs>
		</Card>
	)
}

export default Settings
