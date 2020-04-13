import axios, { AxiosResponse } from 'axios'
import { API_URL } from '../../config/constants'

axios.defaults.baseURL = API_URL

export const signIn = (
	signInPayload: { username?: string; email?: string; rememberMe: boolean; password: string }
): Promise<AxiosResponse> => axios.post('/v1/auth/signin', signInPayload, { withCredentials: true })

export const signUp = (
	signUpPayload: { fullName: string; username: string; email: string; password: string }
): Promise<AxiosResponse> => axios.post('/v1/auth/signup', signUpPayload)

export const checkAccessToken = (accessToken: string): Promise<AxiosResponse>  => axios.get('v1/auth/check-token',
{
	headers: {
		'Authorization': `Bearer ${accessToken}`,
	}
})

export const refreshToken = (): Promise<AxiosResponse> => axios.get('/v1/auth/refresh-token', { withCredentials: true })

export const fetchAllFeeds = (): Promise<AxiosResponse> => axios.get('/v1/title/all')

export const fetchTitleBySlug = (titleSlug: string): Promise<AxiosResponse> => axios.get(`/v1/title/${titleSlug}`)

export const fetchAllCategories = (): Promise<AxiosResponse> => axios.get('/v1/category/all')

export const fetchFeaturedEntryByTitleSlug = (
	titleSlug: string
): Promise<AxiosResponse> => axios.get(`/v1/entry/${titleSlug}/featured`)

export const fetchEntriesByTitleSlug = (
	titleSlug: string,
	page: number
): Promise<AxiosResponse> => axios.get(`/v1/entry/${titleSlug}/all?limit=7&skip=${page}`)

export const fetchOneCategoryById = (
	categoryId: string
): Promise<AxiosResponse> => axios.get(`/v1/category/${categoryId}`)

export const createTitle = (
	createTitlePayload: { name: string; categoryId: string; description?: string },
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

export const createEntry = (
	createEntryPayload: { text: string; titleSlug: string },
	accessToken: string
): Promise<AxiosResponse> => axios.post('/v1/entry/create-entry', createEntryPayload, {
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
