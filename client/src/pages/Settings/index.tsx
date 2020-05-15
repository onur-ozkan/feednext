// Antd dependencies
import { Card, Tabs, Typography } from 'antd'
import { UserOutlined } from '@ant-design/icons'

// Other dependencies
import React from 'react'
import { useSelector } from 'react-redux'

// Local files
import { AccountSettings } from './AccountSettings'

const Settings = (): JSX.Element => {
	const user = useSelector((state: any) => state.user?.attributes.user)
	const accessToken = useSelector((state: any) => state.global.accessToken)

	return (
		<>
			<Card>
				<Tabs size="default" tabPosition="top" animated={false} defaultActiveKey="profile" onChange={}>
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
		</>
	)
}

export default Settings
