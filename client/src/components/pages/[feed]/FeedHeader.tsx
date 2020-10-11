// Antd dependencies
import {
	Button,
	Row,
	PageHeader,
	Tag,
	Rate,
	Col,
	Modal,
	message,
	Popconfirm,
	Statistic,
	Typography,
	Card
} from 'antd'
import {
	InfoCircleOutlined,
	CheckOutlined,
	LoadingOutlined,
	DeleteFilled,
	EditOutlined,
	WarningOutlined
} from '@ant-design/icons'

// Other dependencies
import React, { useState } from 'react'
import { format, parseISO } from 'date-fns'
import { useRouter } from 'next/router'
import stringToColor from 'string-to-color'

// Local files
import { getUserRateOfTitle, rateTitle, deleteTitle } from '@/services/api'
import { SignModal } from '@/components/global/SignModal'
import { API_URL } from '@/../config/constants'
import { FeedHeaderProps } from '@/@types/pages'
import './style.less'

const FeedHeader: React.FC<FeedHeaderProps> = (props): JSX.Element => {
	const {
		titleData,
		openUpdateModal,
		accessToken,
		averageTitleRate,
		refreshTitleRate,
		userRole
	} = props

	const router = useRouter()
	const [signModalVisibility, setSignModalVisibility] = useState(false)
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

	const handleRateModalVisibility = async (): Promise<void> => {
		if (!accessToken) {
			setSignModalVisibility(true)
			return
		}

		setRateModalVisibility(true)
		await getUserRateOfTitle(titleData.attributes.id, accessToken)
			.then(res => setInitialRatingModalValue(res.data.attributes.rate))
			.catch(_error => setInitialRatingModalValue(0))
	}

	const handleTagsView = (tags: string[]) => {
		return tags.map(tag => {
			return (
				<div key={tag} className={'custom-tag'} style={{ backgroundColor: stringToColor(tag) }}>
					<Typography.Text style={{ color: (parseInt(stringToColor(tag).replace('#', ''), 16) > 0xffffff / 2) ? '#000' : '#fff', background: (parseInt(stringToColor(tag).replace('#', ''), 16) > 0xffffff / 2) ? '#fff' : '#000', opacity: 0.9 }}>
						#{tag}
					</Typography.Text>
				</div>
			)
		})
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
				title: 'Tags',
				value: titleData.attributes.tags
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
			},
			{
				title: 'Updated by',
				value: titleData.attributes.updated_by || ' - ',
				href: titleData.attributes.updated_by ? `/user/${titleData.attributes.opened_by}` : undefined
			},
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
							<span
								onClick={() => {
									if (item.href) router.replace('/user/[username]', item.href)
								}}
							>
								<Card.Grid
									key={item.title}
									className={'cardGrids'}
									style={{
										cursor: item.href ? 'pointer' : 'normal'
									}}
								>
									<Statistic
										suffix={item.suffix}
										title={item.title}
										// @ts-ignore
										value={item.value}
									/>
								</Card.Grid>
							</span>
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
				router.push('/')
			})
			.catch(error => message.error(error.response.data.message))
	}

	return (
		<>
			<SignModal
				closeModal={(): void => setSignModalVisibility(false)}
				visibility={signModalVisibility}
			/>
			<PageHeader
				title={
					<>
						{handleTagsView(titleData.attributes.tags)}
						<Row>
							<Col style={{ margin: '0 5px -15px 0' }}>
								<Typography.Title level={2} style={{ whiteSpace: 'pre-wrap' }}>
									{titleData.attributes.name}
								</Typography.Title>
							</Col>
							<Col>
								<Rate disabled value={averageTitleRate} />
								<Button onClick={handleRateModalVisibility} style={{ marginLeft: 5 }} type="primary" size="small">
									<Typography.Text style={{ color: 'white' }} strong>
										Rate
									</Typography.Text>
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
			>
				<img
					src={`${API_URL}/v1/title/${titleData.attributes.id}/image`}
					width={150}
					alt="Title Image"
				/>
			</PageHeader>
			{handleDetailsModalRender()}
			{handleRateModalRender()}
		</>
	)
}

export default FeedHeader
