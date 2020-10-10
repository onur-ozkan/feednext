// Local files
import { fetchTitle, fetchFeaturedEntryByTitleId, getAverageTitleRate, fetchEntriesByTitleId } from '@/services/api'
import { TitleResponseData } from '@/@types/api'
import { EntryAttributes } from '@/@types/pages'
import { FeedPageInitials } from '@/@types/initializations'

export const getFeedPageInitialValues = async (titleSlug: string, entryPage: number): Promise<FeedPageInitials> => {
    let titleData: TitleResponseData
	let featuredEntry: string
	let averageTitleRate: number
	let entryList: {
        entries: EntryAttributes[],
		count: number
    }
	let keywords: string
	let error: boolean = false

	await fetchTitle(titleSlug, 'slug').then(async titleResponse => {
		await fetchFeaturedEntryByTitleId(titleResponse.data.attributes.id).then(({ data }) => featuredEntry = data.attributes.text).catch(_error => {})
		await getAverageTitleRate(titleResponse.data.attributes.id).then(averageRateResponse => averageTitleRate = averageRateResponse.data.attributes.rate || 0)
		titleData = titleResponse.data

		await fetchEntriesByTitleId(titleData.attributes.id, entryPage, null).then(async ({ data }) => {
			const entriesAsKeywords: any[] = []
			await data.attributes.entries.map((entry: { text: string }) => {
				const keywordsArray = entry.text.split(' ')
				keywordsArray.map((keyword: string) => entriesAsKeywords.push(keyword))
			})
			keywords = entriesAsKeywords.join(', ')
			entryList = data.attributes
		})
	}).catch(_error => error = true)

	return {
		titleData,
		featuredEntry,
		averageTitleRate,
		entryList,
		keywords,
		error
	}
}