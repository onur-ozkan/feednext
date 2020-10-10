// Local files
import { GetUserDataResponse } from '@/@types/api'
import { TitleResponseData, EntryResponseData } from '@/@types/api'

export interface EntryPageInitials {
    title: TitleResponseData,
	averageTitleRate: number,
	entryData: EntryResponseData,
}