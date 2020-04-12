import React, { useState } from 'react'
import { Button, Dropdown, Menu, Row, PageHeader, Tag, Rate, Col, Modal } from 'antd'
import { EllipsisOutlined, InfoCircleOutlined, CheckOutlined } from '@ant-design/icons'

const FeedHeader: React.FC = ({ titleData, categoryData }): JSX.Element => {
	const [rateModalVisibility, setRateModalVisibility] = useState(false)
	const [rateValue, setRateValue] = useState(0)

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

	const Content = ({ children, extraContent }) => {
		return (
			<Row>
				<div className="image">{extraContent}</div>
			</Row>
		)
	}

	const handleOnRatingChange = (value: number): void => setRateValue(value)

	const handleTitleVoting = (): void => {
		// TODO
		// vote the title with rateValue
		setRateModalVisibility(false)
	}

	return (
		<>
			<PageHeader
				title={
					<>
						<Tag color="blue">{categoryData.attributes.name}</Tag>
						<Row>
							<Col style={{ margin: '0px 5px -15px 0px' }}>
								<h1>{titleData.attributes.name}</h1>
							</Col>
							<Col>
								<Rate disabled allowHalf defaultValue={titleData.attributes.rate} />
								<Button onClick={(): void => setRateModalVisibility(true)} style={{ marginLeft: 5 }} type="primary" size="small">
									Rate
								</Button>
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
				/>
			</PageHeader>
			<Modal
				transitionName='fade'
				style={{ textAlign: 'center'}}
				visible={rateModalVisibility}
				onOk={handleTitleVoting}
				closable={false}
				width='225px'
				footer={null}
				onCancel={(): void => setRateModalVisibility(false)}
			>
				<Rate onChange={handleOnRatingChange} style={{ marginRight: 10 }} />
				<Button shape="circle" icon={<CheckOutlined />} onClick={handleTitleVoting} />
			</Modal>
		</>
	)
}

export default FeedHeader
