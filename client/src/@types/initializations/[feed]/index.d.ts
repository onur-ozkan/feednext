// Local files
import { TitleResponseData } from '@/@types/api'
import { EntryAttributes } from '@/@types/pages'

export interface FeedPageInitials {
    titleData: TitleResponseData,
	featuredEntry: string,
	averageTitleRate: number,
	entryList: {
        entries: EntryAttributes[],
		count: number
    },
	keywords: string,
	error: boolean
}