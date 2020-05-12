// Antd dependencies
import { Comment, Tag, Avatar, Tooltip, PageHeader, Row, Col, Rate, Divider } from 'antd'
import { ArrowUpOutlined } from '@ant-design/icons'

// Other dependencies
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { router } from 'umi'

// Local files
import { fetchEntryByEntryId, fetchTitle, getAverageTitleRate } from '@/services/api'
import { handleArrayFiltering } from '@/services/utils'
import PageLoading from '@/components/PageLoading'
import NotFoundPage from '../404'

const Entry = ({ computedMatch }): JSX.Element => {
	const categoryList = useSelector((state: any) => state.global.categoryList)

	const [isFetchingSuccess, setIsFetchingSuccess] = useState(null)
	const [averageTitleRate, setAverageTitleRate] = useState(null)
	const [titleData, setTitleData] = useState(null)
	const [entryData, setEntryData] = useState(null)
	const [categoryName, setCategoryName] = useState(null)

	useEffect(() => {
		if (titleData && titleData && entryData && categoryName) setIsFetchingSuccess(true)
	}, [averageTitleRate, titleData, entryData, categoryName])

	useEffect(() => {
		// Fetch entry Data
		fetchEntryByEntryId(computedMatch.params.entryId)
			.then(fRes => {
				setEntryData(fRes.data)
				// Fetch title Data
				fetchTitle(fRes.data.attributes.title_id, 'id')
					.then(sRes => {
						setTitleData(sRes.data)
						// Get category
						const category = handleArrayFiltering(categoryList, sRes.data.attributes.category_id)
						setCategoryName(category.name)
						// Fetch average rate of title
						getAverageTitleRate(sRes.data.attributes.id)
							.then(trRes => setAverageTitleRate(trRes.data.attributes.rate || 0))
							.catch(error => setIsFetchingSuccess(false))
					})
					.catch(error => setIsFetchingSuccess(false))
			})
			.catch(error => setIsFetchingSuccess(false))
	}, [])

	if (isFetchingSuccess === null) return <PageLoading />

	if (!!!isFetchingSuccess) return <NotFoundPage />

	const handleHeaderTitleSection = (): JSX.Element => (
		<>
			<Tag color="blue"> {categoryName} </Tag>
			<Row>
				<Col style={{ margin: '0px 5px -15px 0px' }}>
					<h1
						style={{ cursor: 'pointer' }}
						onClick={(): void => router.push(`/feeds/${titleData.attributes.slug}`)}
					> {titleData.attributes.name} </h1>
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
			<span style={{ color: '#818181', fontSize: 15 }} className="comment-action">
				{entryData.attributes.votes.value}
			</span>
		</span>
	]

	const handleCommentTime = (): JSX.Element => (
		<Tooltip title={`Updated at ${entryData.attributes.updated_at}`}>
			<span>
				{entryData.attributes.created_at}
			</span>
		</Tooltip>
	)

	return (
		<>
			<PageHeader
				title={handleHeaderTitleSection()}
				style={{ backgroundColor: 'white' }}
				className="site-page-header"
			>
				<Divider />
				<Comment
					actions={handleCommentVotes()}
					datetime={handleCommentTime()}
					author={
						<span onClick={(): void => router.push(`/user/${entryData.attributes.written_by}`)} style={{ cursor: 'pointer' }}>{entryData.attributes.written_by}</span>
					}
					avatar={
						<Avatar size="large">
							{entryData.attributes.written_by.toUpperCase()[0]}
						</Avatar>
					}
					content={
						<p>
							{entryData.attributes.text}
						</p>
					}
				/>
			</PageHeader>
		</>
	)
}

export default Entry
