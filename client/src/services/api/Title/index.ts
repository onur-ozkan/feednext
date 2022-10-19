// Other dependencies
import axios, { AxiosResponse } from 'axios'

export const fetchAllFeeds = (
	skip: number,
	username: string | undefined,
	tags: string | undefined,
	sortBy?: 'hot' | 'top' | undefined
): Promise<AxiosResponse> => axios.get(
	'/v1/title/all', {
		params: {
			...username && { author: username },
			...tags && { tags },
			...sortBy && { sortBy },
			skip
		}
	}
)

export const searchTitle = (searchValue: string): Promise<AxiosResponse> => axios.get(`/v1/title/search?searchValue=${searchValue}`)

export const fetchTitle = (titleSlug: string, type: 'id' | 'slug'): Promise<AxiosResponse> => axios.get(`/v1/title/${titleSlug}`, {
	params: {
		type
	}
})

export const createTitle = (
	createTitlePayload: FormData,
	accessToken: string
): Promise<AxiosResponse> => axios.post('/v1/title/create-title', createTitlePayload, {
	headers: {
		'Authorization': `Bearer ${accessToken}`,
	}
})

export const rateTitle = (
	rateValue: number,
	titleId: string,
	accessToken: string
): Promise<AxiosResponse> => axios.patch(`/v1/title/${titleId}/rate`, { rateValue }, {
	headers: {
		'Authorization': `Bearer ${accessToken}`,
	}
})

export const updateTitleImage = (
	accessToken: string,
	titleId: string,
	formData: FormData
): Promise<AxiosResponse> => axios.put(`/v1/title/image`, formData, {
	headers: {
		'Authorization': `Bearer ${accessToken}`,
	},
	params: { titleId }
})

export const deleteTitleImage = (
	accessToken: string,
	titleId: string
): Promise<AxiosResponse> => axios.delete(`/v1/title/image`, {
	headers: {
		'Authorization': `Bearer ${accessToken}`,
	},
	params: { titleId }
})

export const deleteTitle = (
	accessToken: string,
	titleId: string
): Promise<AxiosResponse> => axios.delete(`/v1/title/${titleId}`, {
	headers: {
		'Authorization': `Bearer ${accessToken}`,
	}
})

export const updateTitle = (
	accessToken: string,
	titleId: string,
	payload: {
		name: string,
		tags: string[]
	}
): Promise<AxiosResponse> => axios.patch(`/v1/title/${titleId}`, payload, {
	headers: {
		'Authorization': `Bearer ${accessToken}`,
	}
})

export const getUserRateOfTitle = (
	titleId: string,
	accessToken: string
): Promise<AxiosResponse> => axios.get(`/v1/title/${titleId}/rate-of-user`, {
	headers: {
		'Authorization': `Bearer ${accessToken}`,
	}
})

export const getAverageTitleRate = (
	titleId: string,
): Promise<AxiosResponse> => axios.get(`/v1/title/${titleId}/average-rate`)
