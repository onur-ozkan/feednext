import React, { useEffect, useState } from 'react'
import FeedHeader from './components/FeedHeader'
import FeedEntries from './components/FeedEntries'
import { fetchEntriesByTitleSlug, fetchTitleBySlug, fetchOneCategoryById, getAverageTitleRate } from '@/services/api'
import { PageLoading } from '@ant-design/pro-layout'
import { useSelector } from 'react-redux'

const Feed: React.FC = ({ computedMatch }): JSX.Element => {
	const accessToken = useSelector((state: any) => state.global.accessToken)

	const [title, setTitle]: any = useState(null)
	const [averageTitleRate, setAverageTitleRate] = useState(null)
	const [category, setCategory]: any = useState(null)
	const [entryList, setEntryList]: any = useState(null)

	const handleEntryFetching = (page: number): void => {
		fetchEntriesByTitleSlug(computedMatch.params.feedSlug, page).then(res => {
			setEntryList(res.data.attributes)
		})
	}

	const getTitleRate = async (titleId: string): Promise<void> => {
		await getAverageTitleRate(titleId).then(res => setAverageTitleRate(res.data.attributes.rate))
	}

	useEffect(() => {
		fetchTitleBySlug(computedMatch.params.feedSlug).then(async res => {
			await fetchOneCategoryById(res.data.attributes.category_id).then(res => setCategory(res.data))
			getTitleRate(res.data.id)
			await setTitle(res.data)
		})
		if (!entryList) handleEntryFetching(0)
	}, [])

	if (!entryList || !title || !category || (!averageTitleRate && averageTitleRate !== 0)) return <PageLoading />

	return (
		<>
			<FeedHeader
				accessToken={accessToken}
				titleData={title}
				categoryData={category}
				averageTitleRate={averageTitleRate}
				refreshTitleRate={getTitleRate}
			/>
			<FeedEntries
				accessToken={accessToken}
				entryData={entryList}
				titleData={title}
				handleEntryFetching={handleEntryFetching}
				setEntryList={setEntryList}
			/>
		</>
	)
}

export default Feed
