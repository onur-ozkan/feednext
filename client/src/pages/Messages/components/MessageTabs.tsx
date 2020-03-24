import React, { useState } from 'react'
import { Tabs, Card } from 'antd'
import ChatScreen from './ChatScreen'

const MessageTabs: React.FC = () => {
	return (
		<Card>
			<Tabs tabPosition="left">
				<Tabs.TabPane tab="Message Person X" key="1">
					<ChatScreen />
				</Tabs.TabPane>
				<Tabs.TabPane tab="Message Person Y" key="2">
					Content of Tab 2
				</Tabs.TabPane>
				<Tabs.TabPane tab="Message Person Z" key="3">
					Content of Tab 3
				</Tabs.TabPane>
				<Tabs.TabPane tab="Message Person X" key="4">
					<ChatScreen />
				</Tabs.TabPane>
				<Tabs.TabPane tab="Message Person Y" key="5">
					Content of Tab 2
				</Tabs.TabPane>
			</Tabs>
		</Card>
	)
}

export default MessageTabs
