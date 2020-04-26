import React, { useState } from 'react'
import { Button, Row, PageHeader, Tag, Rate, Col, Modal, message, Popconfirm, Statistic, Typography, Card } from 'antd'
import { InfoCircleOutlined, CheckOutlined, LoadingOutlined, DeleteFilled, EditOutlined, WarningOutlined, LikeOutlined } from '@ant-design/icons'
import { getUserRateOfTitle, rateTitle, deleteTitle } from '@/services/api'
import { format, parseISO } from 'date-fns'
import { router } from 'umi'

const FeedHeader: React.FC = (props: any): JSX.Element => {
	const {
		titleData,
		openUpdateModal,
		categoryData,
		accessToken,
		averageTitleRate,
		refreshTitleRate,
		userRole,
		styles
	} = props

	const [rateModalVisibility, setRateModalVisibility] = useState(false)
	const [detailsModalVisibility, setDetailsModalVisibility] = useState(false)
	const [initialRatingModalValue, setInitialRatingModalValue] = useState<number | null>(null)
	const [rateValue, setRateValue] = useState(0)

	const handleOnRatingChange = (value: number): void => setRateValue(value)

	const handleTitleVoting = async (): Promise<void> => {
		await rateTitle(rateValue, titleData.attributes.id, accessToken)
			.then(_res => refreshTitleRate(titleData.attributes.id))
			.catch(error => message.error(error.response.data.message))
		setRateModalVisibility(false)
	}

	console.log(styles)

	const handleRateModalVisibility = async (): Promise<void> => {
		if (!accessToken) return // TODO pop sign in window

		setRateModalVisibility(true)
		await getUserRateOfTitle(titleData.attributes.id, accessToken)
			.then(res => setInitialRatingModalValue(res.data.attributes.rate))
			.catch(_error => setInitialRatingModalValue(0))
	}

	const handleRateModalRender = (): JSX.Element => (
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
	)

	const handleDetailsModalRender = (): JSX.Element => {
		const gridData = [
			{
				title: 'Title Name',
				value: titleData.attributes.name
			},
			{
				title: 'Category',
				value: categoryData.name
			},
			{
				title: 'Entry Count',
				value: titleData.attributes.entry_count
			},
			{
				title: 'Rate',
				value: averageTitleRate,
				suffix: '/ 5'

			},
			{
				title: 'Opened by',
				value: titleData.attributes.opened_by,
				href: `/user/${titleData.attributes.opened_by}`
			},
			{
				title: 'Opened At',
				value: format(parseISO(titleData.attributes.created_at), 'dd LLL yyyy')
			}
		]

		return (
			<Modal
				transitionName='fade'
				visible={detailsModalVisibility}
				width="750px"
				closable={false}
				footer={null}
				onCancel={(): void => setDetailsModalVisibility(false)}
			>
				<Card style={{ padding: 15 }} bordered={false}>
					{gridData.map(item => {
						return (
							<Card.Grid
								key={item.title}
								className={styles.cardGrids}
								style={{
									cursor: item.href ? 'pointer' : 'normal'
								}}
								onClick={(): void  => router.push(item.href)}
							>
								<Statistic
									suffix={item.suffix}
									title={item.title}
									value={item.value}
								/>
							</Card.Grid>
						)
					})}
				</Card>
			</Modal>
		)
	}

	const handleTitleDelete = (): void => {
		deleteTitle(accessToken, titleData.attributes.id)
			.then(_res => {
				message.success('Title successfully deleted')
				router.push('/feeds')
			})
			.catch(error => message.error(error.response.data.message))
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
								<Button onClick={handleRateModalVisibility} style={{ marginLeft: 5 }} type="primary" size="small">
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
						<Button
							onClick={(): void => setDetailsModalVisibility(true)}type="dashed"
							icon={<InfoCircleOutlined />}
						>
							Details
						</Button>
					</>
				]}
			/>
			{handleDetailsModalRender()}
			{handleRateModalRender()}
		</>
	)
}

export default FeedHeader
