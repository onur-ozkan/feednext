import axios, { AxiosResponse } from 'axios'

export const fetchEntryByEntryId = (entryId: string): Promise<AxiosResponse> => axios.get(`v1/entry/${entryId}`)

export const fetchFeaturedEntryByTitleId = (
	titleId: string
): Promise<AxiosResponse> => axios.get(`/v1/entry/by-title/${titleId}/featured`)

export const fetchEntriesByTitleId = (
	titleId: string,
	skip: number,
	sortBy?: 'newest' | 'top' | null
): Promise<AxiosResponse> => axios.get(`/v1/entry/by-title/${titleId}/all`, {
	params: {
		skip,
		...sortBy && { sortBy }
	}
})

export const fetchAllEntriesByAuthor = (
	username: string,
	skip: number
): Promise<AxiosResponse> => axios.get(`/v1/entry/by-author/${username}/all?skip=${skip}`)

export const createEntry = (
	createEntryPayload: { text: string; titleId: string },
	accessToken: string
): Promise<AxiosResponse> => axios.post('/v1/entry/create-entry', createEntryPayload, {
	headers: {
		'Authorization': `Bearer ${accessToken}`,
	}
})

export const updateEntry = (
	entryId: string,
	text: string,
	accessToken: string
): Promise<AxiosResponse> => axios.patch(`/v1/entry/${entryId}`, { text }, {
	headers: {
		'Authorization': `Bearer ${accessToken}`,
	}
})

export const voteEntry = (
	entryId: string,
	voteTo: string,
	accessToken: string
): Promise<AxiosResponse> => axios.patch(`/v1/entry/${voteTo}-vote/${entryId}`, {}, {
	headers: {
		'Authorization': `Bearer ${accessToken}`,
	}
})

export const undoEntryVote = (
	entryId: string,
	accessToken: string,
	isUpVoted: boolean
): Promise<AxiosResponse> => axios.patch(`/v1/entry/undo-vote/${entryId}?isUpVoted=${isUpVoted}`, {}, {
	headers: {
		'Authorization': `Bearer ${accessToken}`,
	}
})

export const deleteEntry = (
	entryId: string,
	accessToken: string
): Promise<AxiosResponse> => axios.delete(`/v1/entry/${entryId}`, {
	headers: {
		'Authorization': `Bearer ${accessToken}`,
	}
})
