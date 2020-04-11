import React, { useEffect, useState } from 'react'
import FeedHeader from './components/FeedHeader'
import FeedEntries from './components/FeedEntries'
import { fetchEntriesByTitleSlug, fetchTitleBySlug, fetchOneCategoryById } from '@/services/api'
import { PageLoading } from '@ant-design/pro-layout'

const Feed: React.FC = ({ computedMatch }) => {
	const [title, setTitle]: any = useState(null)
	const [category, setCategory]: any = useState(null)
	const [entryList, setEntryList]: any = useState(null)
	useEffect(() => {
		fetchTitleBySlug(computedMatch.params.feedSlug).then(res => {
			fetchOneCategoryById(res.data.attributes.category_id).then(res => setCategory(res.data))
			setTitle(res.data)
		})
		fetchEntriesByTitleSlug(computedMatch.params.feedSlug).then(res => setEntryList(res.data.attributes))
	}, [])

	if (!entryList || !title || !category) return <PageLoading />

	return (
		<>
			<FeedHeader categoryData={category} titleData={title} />
			<FeedEntries entryData={entryList} titleData={title} />
		</>
	)
}

export default Feed
