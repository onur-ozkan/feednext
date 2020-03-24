import React from 'react'
import { Button, Dropdown, Menu, Row, PageHeader, Tag, Rate, Col } from 'antd'
import { EllipsisOutlined, InfoCircleOutlined } from '@ant-design/icons'

const FeedHeader: React.FC = () => {
	const menu = (
		<Menu>
			<Menu.Item>
				<a target="_blank" rel="noopener noreferrer" href="http://www.alipay.com/">
					1st menu item
				</a>
			</Menu.Item>
			<Menu.Item>
				<a target="_blank" rel="noopener noreferrer" href="http://www.taobao.com/">
					2nd menu item
				</a>
			</Menu.Item>
			<Menu.Item>
				<a target="_blank" rel="noopener noreferrer" href="http://www.tmall.com/">
					3rd menu item
				</a>
			</Menu.Item>
		</Menu>
	)

	const DropdownMenu = () => {
		return (
			<Dropdown trigger={['click']} key="more" overlay={menu}>
				<Button
					style={{
						border: 'none',
						padding: 0,
					}}
				>
					<EllipsisOutlined
						style={{
							fontSize: 20,
							verticalAlign: 'top',
						}}
					/>
				</Button>
			</Dropdown>
		)
	}

	const IconLink = ({ src, text }) => (
		<a
			style={{
				marginRight: 16,
			}}
		>
			<img
				style={{
					marginRight: 8,
				}}
				src={src}
				alt={text}
			/>
			{text}
		</a>
	)

	const Content = ({ children, extraContent }) => {
		return (
			<Row>
				<div className="image">{extraContent}</div>
			</Row>
		)
	}

	return (
		<>
			<PageHeader
				title={
					<>
						<Tag color="blue">Phone</Tag>
						<Row>
							<Col style={{ margin: '0px 5px -15px 0px' }}>
								<h1>Xphone Model 7s Plus</h1>
							</Col>
							<Col>
								<Rate allowHalf defaultValue={2.5} />
							</Col>
						</Row>
					</>
				}
				style={{ backgroundColor: 'white' }}
				className="site-page-header"
				extra={[
					<>
						<Button type="dashed" icon={<InfoCircleOutlined />}>
							Details
						</Button>
						<Dropdown trigger={['click']} key="more" overlay={menu}>
							<Button
								style={{
									border: 'none',
									padding: 0,
								}}
							>
								<EllipsisOutlined
									style={{
										fontSize: 20,
										verticalAlign: 'top',
									}}
								/>
							</Button>
						</Dropdown>
					</>,
				]}
			>
				<Content
					extraContent={
						<img
							src="https://gw.alipayobjects.com/zos/antfincdn/K%24NnlsB%26hz/pageHeader.svg"
							alt="content"
							width="100%"
						/>
					}
				></Content>
			</PageHeader>
		</>
	)
}

export default FeedHeader
