// Antd dependencies
import { Comment, Tag, Avatar, Tooltip, PageHeader, Row, Col, Rate, Divider, Typography } from 'antd'
import { ArrowUpOutlined } from '@ant-design/icons'

// Other dependencies
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

// Local files
import { fetchEntryByEntryId, fetchTitle, getAverageTitleRate, fetchOneCategory } from '@/services/api'
import { API_URL, Guest } from '@/../config/constants'
import { TitleResponseData, EntryResponseData } from '@/@types/api'
import { PageHelmet } from '@/components/PageHelmet'
import PageLoading from '@/components/PageLoading'
import NotFoundPage from '../../404'
import AppLayout from '@/layouts/AppLayout'

const Entry = (): JSX.Element => {
	const router = useRouter()

	const [title, setTitle] = useState<TitleResponseData | undefined>(undefined)
	const [categoryName, setCategoryName] = useState<string | undefined>(undefined)
	const [averageTitleRate, setAverageTitleRate] = useState<number | undefined>(undefined)
	const [entryData, setEntryData] = useState<EntryResponseData | undefined>(undefined)
	const [isFetchingSuccess, setIsFetchingSuccess] = useState<boolean | undefined>(undefined)

	useEffect(() => {
		if (title && entryData && categoryName) setIsFetchingSuccess(true)
	}, [averageTitleRate, title, entryData, categoryName])

	useEffect(() => {
		if (router.query.id) {
			// Fetch entry Data
			fetchEntryByEntryId(router.query.id)
				.then(fRes => {
					setEntryData(fRes.data)
					// Fetch title Data
					fetchTitle(fRes.data.attributes.title_id, 'id')
						.then(sRes => {
							setTitle(sRes.data)
							// Get category
							fetchOneCategory(sRes.data.attributes.category_id).then(({ data }) => {
								setCategoryName(data.attributes.name)
							})
							// Fetch average rate of title
							getAverageTitleRate(sRes.data.attributes.id)
								.then(trRes => setAverageTitleRate(trRes.data.attributes.rate || 0))
								.catch(error => setIsFetchingSuccess(false))
						})
						.catch(error => setIsFetchingSuccess(false))
				})
				.catch(error => setIsFetchingSuccess(false))
		}
	}, [router.query.id])

	if (isFetchingSuccess === undefined) return <PageLoading />

	if (!!!isFetchingSuccess) return <NotFoundPage />

	const handleHeaderTitleSection = (): JSX.Element => (
		<>
			<Tag color="blue"> {categoryName} </Tag>
			<Row>
				<Col style={{ margin: '0px 5px -15px 0px' }}>
					<h1
						style={{ cursor: 'pointer' }}
						onClick={() => router.push(`/${title?.attributes.slug}`)}
					>
						{title?.attributes.name}
					</h1>
				</Col>
				<Col>
					<Rate disabled value={averageTitleRate} />
				</Col>
			</Row>
		</>
	)

	const handleCommentVotes = (): JSX.Element[] => [
		<span style={{ padding: '2px 5px 2px 5px', fontSize: 14, opacity: 1, cursor: 'default' }} key="comment-basic-like">
			<Tooltip title="Up Vote">
				<ArrowUpOutlined />
			</Tooltip>
			<span style={{ color: '#818181', fontSize: 15, marginLeft: 2 }} className="comment-action">
				{entryData?.attributes.votes.value}
			</span>
		</span>,
	]

	const handleCommentTime = (): JSX.Element => (
		<Tooltip title={`Updated at ${entryData?.attributes.updated_at}`}>
			<span>{entryData?.attributes.created_at}</span>
		</Tooltip>
	)

	return (
		<AppLayout authority={Guest}>
			<PageHelmet
				title={`${title?.attributes.name} :${categoryName}`}
				description={entryData?.attributes.text}
				author={entryData?.attributes.written_by}
				mediaTitle={title?.attributes.name}
				mediaImage={`${API_URL}/v1/user/pp?username=${entryData?.attributes.written_by}`}
				mediaDescription={entryData?.attributes.text}
				keywords={entryData?.attributes.text.split(' ').join(', ')}
			/>
			<PageHeader title={handleHeaderTitleSection()} style={{ backgroundColor: 'white' }} className="site-page-header">
				<Divider />
				<Comment
					actions={handleCommentVotes()}
					datetime={handleCommentTime()}
					author={
						<Typography.Text
							onClick={() => router.push(`/user/${entryData?.attributes.written_by}`)}
							style={{ cursor: 'pointer', fontSize: 15, color: '#414141' }}
						>
							{entryData?.attributes.written_by}
						</Typography.Text>
					}
					avatar={
						<Avatar
							onClick={() => router.push(`/user/${entryData?.attributes.written_by}`)}
							src={`${API_URL}/v1/user/pp?username=${entryData?.attributes.written_by}`}
						/>
					}
					content={<p>{entryData?.attributes.text}</p>}
				/>
			</PageHeader>
		</AppLayout>
	)
}

export default Entry
