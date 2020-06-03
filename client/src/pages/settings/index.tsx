// Antd dependencies
import { Card, Tabs, Typography } from 'antd'
import { UserOutlined } from '@ant-design/icons'

// Other dependencies
import React from 'react'
import { useSelector } from 'react-redux'

// Local files
import { AccountSettings } from './account-settings'
import { PageHelmet } from '@/components/PageHelmet'
import { User } from '@/../config/constants'
import AppLayout from '@/layouts/AppLayout'

const Settings = (): JSX.Element => {
	const user = useSelector((state: any) => state.user?.attributes.user)
	const accessToken = useSelector((state: any) => state.global.accessToken)

	return (
		<AppLayout authority={User}>
			<PageHelmet
				title="Settings"
				description="Best reviews, comments, feedbacks about anything around the world"
				mediaImage="https://avatars1.githubusercontent.com/u/64217221?s=200&v=4"
				mediaDescription="Best reviews, comments, feedbacks about anything around the world"
			/>
			<Card>
				<Tabs size="default" tabPosition="top" animated={false} defaultActiveKey="profile">
					<Tabs.TabPane
						tab={
							<Typography.Text strong>
								<UserOutlined style={{ margin: 0 }} /> Account Settings
							</Typography.Text>
						}
						key="account"
					>
						<AccountSettings user={user} accessToken={accessToken} />
					</Tabs.TabPane>
				</Tabs>
			</Card>
			<br />
		</AppLayout>
	)
}

export default Settings
