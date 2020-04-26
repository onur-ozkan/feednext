import React, { useState } from 'react'
import { Button, Row, PageHeader, Tag, Rate, Col, Modal, message, Divider, Typography, Popconfirm } from 'antd'
import { InfoCircleOutlined, CheckOutlined, LoadingOutlined, DeleteOutlined, DeleteFilled, EditOutlined, WarningOutlined } from '@ant-design/icons'
import { getUserRateOfTitle, rateTitle, deleteTitle } from '@/services/api'
import { router } from 'umi'

const FeedHeader: React.FC = (props: any): JSX.Element => {
	const { titleData, openUpdateModal, categoryData, accessToken, averageTitleRate, refreshTitleRate, userRole } = props

	const [rateModalVisibility, setRateModalVisibility] = useState(false)
	const [initialRatingModalValue, setInitialRatingModalValue] = useState<number | null>(null)
	const [rateValue, setRateValue] = useState(0)

	const handleOnRatingChange = (value: number): void => setRateValue(value)

	const handleTitleDelete = () => {
		deleteTitle(accessToken, titleData.attributes.id)
			.then(_res => {
				message.success('Title successfully deleted')
				router.push('/feeds')
			})
			.catch(error => message.error(error.response.data.message))
	}

	const handleTitleVoting = async (): Promise<void> => {
		await rateTitle(rateValue, titleData.attributes.id, accessToken)
			.then(_res => refreshTitleRate(titleData.attributes.id))
			.catch(error => message.error(error.response.data.message))
		setRateModalVisibility(false)
	}

	const handleRateModalOpening = async (): Promise<void> => {
		setRateModalVisibility(true)
		await getUserRateOfTitle(titleData.attributes.id, accessToken)
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
						{userRole >= 5 &&
							<Popconfirm
								placement="bottom"
								style={{ fontSize: 15 }}
								icon={<WarningOutlined style={{ color: 'red' }} />}
								title="Are you sure that you want to delete this feed?"
								onConfirm={handleTitleDelete}
								okText="Yes"
								cancelText="No"
							>
								<Button
									shape="circle"
									danger
									icon={<DeleteFilled />}
								/>
							</Popconfirm>
						}
						{userRole >= 4 &&
							<Button onClick={openUpdateModal} icon={<EditOutlined />}>
								Edit
							</Button>
						}
						<Button type="dashed" icon={<InfoCircleOutlined />}>
							Details
						</Button>
					</>
				]}
			/>
			<Modal
				transitionName='fade'
				style={{ textAlign: 'center'}}
				visible={rateModalVisibility}
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
