import React, { useEffect, useState } from 'react'
import { Card, Tabs, Typography, Row, Col, Avatar, Input, Button, Divider } from 'antd'
import { UserOutlined, LoadingOutlined, SettingOutlined, UploadOutlined } from '@ant-design/icons'
import styles from './index.less'

const Settings = (): JSX.Element => {
	const [activeTab, setActiveTab] = useState('account')
	const [tabView, setTabView] = useState<JSX.Element>(
		<div style={{ textAlign: 'center' }}>
			<LoadingOutlined style={{ fontSize: 20 }} />
		</div>
	)

	const handleAccountTabView = (): void => {
		setTabView(
			<Row className={styles.settings}>
				<Col lg={9} md={11} sm={14}>
					<Divider> Full Name </Divider>
					<Input defaultValue="Onur Ozkan" placeholder="Full Name"/>

					<Divider> Password </Divider>
					<Input.Password style={{ marginBottom: 10 }} placeholder="Old Password" />
					<Input.Password style={{ marginBottom: 10 }} placeholder="New Password" />
					<Input.Password style={{ marginBottom: 10 }} placeholder="New Password Again" />

					<Divider> Biography </Divider>
					<Input.TextArea
						autoSize={{ maxRows: 2, minRows: 2}}
						allowClear
						maxLength={155}
						style={{ marginBottom: 20 }}
						defaultValue="Software Engineer | Founder of Feednext.io"
						placeholder="Biography"
					/>

					<Button style={{ width: '100%' }} type="default"> Save Changes </Button>
				</Col>
				<Col span={2} />
				<Col sm={4} style={{ textAlign: 'center' }}>
					<Avatar style={{ marginBottom: 12 }} shape="square" size={150} src="https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png" />
					<br/>
					<Button type="link"> <UploadOutlined /> Change Picture </Button>
				</Col>
			</Row>
		)
	}

	const handleApplicationTabView = (): void => {
		setTabView(
			<div style={{ textAlign: 'center' }}>
				<LoadingOutlined style={{ fontSize: 20 }} />
			</div>
		)
	}

	useEffect(() => {
		switch (activeTab) {
			case 'account':
				handleAccountTabView()
			break
		case 'application':
			handleApplicationTabView()
			break
		}
	}, [activeTab])

	const handleTabChange = (key: string): void => setActiveTab(key)

	return (
		<Card>
			<Tabs size="default" tabPosition="top" animated={false} defaultActiveKey="profile" onChange={handleTabChange}>
				<Tabs.TabPane
					tab={
						<Typography.Text strong>
							<UserOutlined style={{ margin: 0 }} /> Account Settings
						</Typography.Text>
					}
					key="account"
				>
					{tabView}
				</Tabs.TabPane>
				<Tabs.TabPane
					tab={
						<Typography.Text strong>
							<SettingOutlined style={{ margin: 0 }} /> Application Settings
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
