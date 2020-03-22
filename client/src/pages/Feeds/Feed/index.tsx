import React from 'react'
import { Card, Button, Dropdown, Menu } from 'antd'
import { EllipsisOutlined, UserOutlined } from '@ant-design/icons'
import Meta from 'antd/lib/card/Meta'

const Feed: React.FC = () => {
	const menu = (
		<Menu>
			<Menu.Item key="1">
				<UserOutlined />
				1st menu item
			</Menu.Item>
			<Menu.Item key="2">
				<UserOutlined />
				2nd menu item
			</Menu.Item>
			<Menu.Item key="3">
				<UserOutlined />
				3rd item
			</Menu.Item>
		</Menu>
	)

	return (
		<>
			<Card>
				<Meta
					title={<h1>What is Lorem Ipsum ?</h1>}
					description={
						<p>
							Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
							labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
							nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
							velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
							proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
						</p>
					}
				/>
				<div style={{ float: 'right' }}>
					<Dropdown trigger={['click']} overlay={menu}>
						<Button type="default" shape="circle" icon={<EllipsisOutlined />} />
					</Dropdown>
				</div>
			</Card>
		</>
	)
}

export default Feed
