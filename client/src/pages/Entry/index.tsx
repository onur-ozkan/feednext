import React, { useEffect, useState } from 'react'
import { Comment, Tag, Avatar, Tooltip, PageHeader, Row, Col, Rate, Divider } from 'antd'
import { PageLoading } from '@ant-design/pro-layout'
import { fetchEntryByEntryId, fetchTitleBySlug, getAverageTitleRate, fetchOneCategoryById } from '@/services/api'
import NotFoundPage from '../404'
import { ArrowUpOutlined } from '@ant-design/icons'

const Entry = ({ computedMatch }): JSX.Element => {

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
				fetchTitleBySlug(fRes.data.attributes.title_slug)
					.then(sRes => {
						setTitleData(sRes.data)
						// Fetch category
						fetchOneCategoryById(sRes.data.attributes.category_id)
							.then(tRes => setCategoryName(tRes.data.attributes.name))
							.catch(error => setIsFetchingSuccess(false))
						// Fetch average rate of title
						getAverageTitleRate(sRes.data.id)
							.then(frRes => setAverageTitleRate(frRes.data.attributes.rate || 0))
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
					<h1> {titleData.attributes.name} </h1>
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
				{entryData.attributes.votes}
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
						<span style={{ cursor: 'pointer' }}>@{entryData.attributes.written_by}</span>
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
