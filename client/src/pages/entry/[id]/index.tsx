// Antd dependencies
import { Comment, Tag, Avatar, Tooltip, PageHeader, Row, Col, Rate, Divider, Typography } from 'antd'
import { ArrowUpOutlined } from '@ant-design/icons'

// Other dependencies
import React, { useState } from 'react'
import { useRouter } from 'next/router'

// Local files
import { API_URL, Guest } from '@/../config/constants'
import { TitleResponseData, EntryResponseData } from '@/@types/api'
import { PageHelmet } from '@/components/global/PageHelmet'
import { getEntryPageInitialValues } from '@/services/initializations/[entry]'
import { NextPage } from 'next'
import { EntryPageInitials } from '@/@types/initializations'
import NotFoundPage from '../../404'
import AppLayout from '@/layouts/AppLayout'

const Entry: NextPage<EntryPageInitials> = (props): JSX.Element => {
	const router = useRouter()

	const [title, setTitle] = useState<TitleResponseData>(props.title)
	const [categoryName, setCategoryName] = useState<string>(props.categoryName)
	const [averageTitleRate, setAverageTitleRate] = useState<number>(props.averageTitleRate)
	const [entryData, setEntryData] = useState<EntryResponseData>(props.entryData)


	if (!title) return <NotFoundPage />

	const handleHeaderTitleSection = (): JSX.Element => (
		<>
			<Tag color="#6ec49a"> {categoryName} </Tag>
			<Row>
				<Col style={{ margin: '0px 5px -15px 0px' }}>
					<Typography.Title
						level={2}
						style={{ cursor: 'pointer', whiteSpace: 'pre-wrap' }}
						onClick={() => router.push('/[feed]', `/${title?.attributes.slug}`)}
					>
						{title?.attributes.name}
					</Typography.Title>
				</Col>
				<Col>
					<Rate disabled value={averageTitleRate} />
				</Col>
			</Row>
		</>
	)

	const handleCommentVotes = (): JSX.Element[] => [
		<span style={{ padding: '2px 5px 2px 5px', fontSize: 14, opacity: 1, cursor: 'default' }} key="comment-basic-like">
			<Tooltip title="Votes">
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
				<img
					src={`${API_URL}/v1/title/${title.attributes.id}/image`}
					width={150}
					alt="Title Image"
				/>
				<Divider />
				<Comment
					actions={handleCommentVotes()}
					datetime={handleCommentTime()}
					author={
						<Typography.Text
							onClick={() => router.push('/user/[username]', `/user/${entryData?.attributes.written_by}`)}
							style={{ cursor: 'pointer', fontSize: 15, color: '#414141' }}
						>
							{entryData?.attributes.written_by}
						</Typography.Text>
					}
					avatar={
						<Avatar
							onClick={() => router.push('/user/[username]', `/user/${entryData?.attributes.written_by}`)}
							src={`${API_URL}/v1/user/pp?username=${entryData?.attributes.written_by}`}
							alt="Author Image"
						/>
					}
					content={<p>{entryData?.attributes.text}</p>}
				/>
			</PageHeader>
		</AppLayout>
	)
}

Entry.getInitialProps = async (context: any) => await getEntryPageInitialValues(context.query.id)

export default Entry
