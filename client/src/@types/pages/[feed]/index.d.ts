// Local files
import { TitleResponseData, EntryResponseData} from '@/@types/api'

export interface EntryAttributes {
	id: string,
	text: string,
	title_id: string,
	written_by: string,
	votes: {
		up_voted: string[],
		down_voted: string[],
		value: number
	},
	created_at: string,
	updated_at: string
}

export interface FeedHeaderProps {
	accessToken: string,
	titleData: TitleResponseData,
	averageTitleRate: number,
	userRole: number,
	openUpdateModal: () => void,
	refreshTitleRate: (titleId: string) => Promise<void>
}

export interface FeedEntriesProps {
	accessToken: string,
	titleData: TitleResponseData,
	defaultPage: number | undefined,
	sortEntriesBy: 'newest' | 'top' | null,
	entryList: {
		entries: EntryAttributes[],
		count: number
	},
	setSortEntriesBy: React.Dispatch<React.SetStateAction<'newest' | 'top' | null>>,
	setEntryList: React.Dispatch<React.SetStateAction<{
		entries: EntryAttributes[],
		count: number
	} | null>>,
	handleEntryFetching: (page: number) => void,
}
