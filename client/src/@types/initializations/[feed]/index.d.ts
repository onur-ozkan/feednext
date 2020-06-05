// Local files
import { TitleResponseData, CategoryResponseData } from "@/@types/api"
import { EntryAttributes } from "@/@types/pages"

export interface FeedPageInitials {
    titleData: TitleResponseData,
	categoryData: CategoryResponseData,
	featuredEntry: string,
	averageTitleRate: number,
	entryList: {
        entries: EntryAttributes[],
		count: number
    },
	keywords: string,
	error: boolean
}