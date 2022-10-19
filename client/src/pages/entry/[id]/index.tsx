// Antd dependencies
import { Comment, Tag, Avatar, Tooltip, PageHeader, Row, Col, Rate, Divider, Typography } from 'antd'
import { ArrowUpOutlined } from '@ant-design/icons'

// Other dependencies
import React, { useState } from 'react'
import { useRouter } from 'next/router'
import stringToColor from 'string-to-color'

// Local files
import { API_URL } from '@/../config/constants'
import { TitleResponseData, EntryResponseData } from '@/@types/api'
import { PageHelmet } from '@/components/global/PageHelmet'
import { getEntryPageInitialValues } from '@/services/initializations/[entry]'
import { NextPage } from 'next'
import { EntryPageInitials } from '@/@types/initializations'
import { AppLayout } from '@/layouts/AppLayout'
import { Roles } from '@/enums'
import NotFoundPage from '../../404'

const Entry: NextPage<EntryPageInitials> = (props): JSX.Element => {
	const router = useRouter()

	const [title, setTitle] = useState<TitleResponseData>(props.title)
	const [averageTitleRate, setAverageTitleRate] = useState<number>(props.averageTitleRate)
	const [entryData, setEntryData] = useState<EntryResponseData>(props.entryData)


	if (!title) return <NotFoundPage />

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

	const handleHeaderTitleSection = (): JSX.Element => (
		<>
			{handleTagsView(title.attributes.tags)}
			<Row>
				<Col style={{ margin: '0 5px -15px 0' }}>
					<Typography.Title
						level={2}
						style={{ cursor: 'pointer', whiteSpace: 'pre-wrap' }}
					>
						<span onClick={() => router.push('/[feed]', `/${title?.attributes.slug}`)}>
							{title?.attributes.name}
						</span>
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
		<AppLayout authority={Roles.Guest}>
			<PageHelmet
				title={`${title?.attributes.name}`}
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
							style={{ cursor: 'pointer', fontSize: 15, color: '#414141' }}
						>
							<span onClick={() => router.push('/user/[username]', `/user/${entryData?.attributes.written_by}`)}>
								{entryData?.attributes.written_by}
							</span>
						</Typography.Text>
					}
					avatar={
						<span onClick={() => router.push('/user/[username]', `/user/${entryData?.attributes.written_by}`)}>
							<Avatar
								src={`${API_URL}/v1/user/pp?username=${entryData?.attributes.written_by}`}
								alt="Author Image"
							/>
						</span>
					}
					content={<p>{entryData?.attributes.text}</p>}
				/>
			</PageHeader>
		</AppLayout>
	)
}

Entry.getInitialProps = async (context: any) => await getEntryPageInitialValues(context.query.id)

export default Entry
