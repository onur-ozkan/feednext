import React, { useState } from 'react'
import { Button, Dropdown, Menu, Row, PageHeader, Tag, Rate, Col, Modal, message } from 'antd'
import { EllipsisOutlined, InfoCircleOutlined, CheckOutlined, LoadingOutlined } from '@ant-design/icons'
import { getUserRateOfTitle, rateTitle } from '@/services/api'

const FeedHeader: React.FC = (props: any): JSX.Element => {
	const { titleData, categoryData, accessToken, averageTitleRate, refreshTitleRate } = props

	const [rateModalVisibility, setRateModalVisibility] = useState(false)
	const [initialRatingModalValue, setInitialRatingModalValue] = useState<number | null>(null)
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

	const handleTitleVoting = async (): Promise<void> => {
		await rateTitle(rateValue, titleData.id, accessToken)
			.then(_res => refreshTitleRate(titleData.id))
			.catch(error => message.error(error.response.data.message))
		setRateModalVisibility(false)
	}

	const handleRateModalOpening = async (): Promise<void> => {
		setRateModalVisibility(true)
		await getUserRateOfTitle(titleData.id, accessToken)
			.then(res => setInitialRatingModalValue(res.data.attributes.rate))
			.catch(_error => setInitialRatingModalValue(0))
	}

	return (
		<>
			<PageHeader
				title={
					<>
						<Tag color="blue">{categoryData.name}</Tag>
						<Row>
							<Col style={{ margin: '0px 5px -15px 0px' }}>
								<h1>{titleData.attributes.name}</h1>
							</Col>
							<Col>
								<Rate disabled value={averageTitleRate} />
								<Button onClick={handleRateModalOpening} style={{ marginLeft: 5 }} type="primary" size="small">
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
				{ initialRatingModalValue || initialRatingModalValue === 0  ?
					<>
						<Rate defaultValue={initialRatingModalValue} onChange={handleOnRatingChange} style={{ marginRight: 10 }} />
						<Button shape="circle" icon={<CheckOutlined />} onClick={handleTitleVoting} />
					</>
					:
					<>
						<LoadingOutlined style={{ fontSize: 24 }} spin />
					</>
				}
			</Modal>
		</>
	)
}

export default FeedHeader
