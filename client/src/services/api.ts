import axios, { AxiosResponse } from 'axios'
import { API_URL } from '../../config/constants'

axios.defaults.baseURL = API_URL

export const checkAccessToken = (token: string): Promise<AxiosResponse>  => axios.get(
	'v1/auth/check-token',
	{
		headers: {
			Authorization: token
		}
	}
)

export const signIn = (
	signInPayload: { username?: string; email?: string; password: string }
): Promise<AxiosResponse> => axios.post('/v1/auth/signin', signInPayload)

export const signUp = (
	signUpPayload: { fullName: string; username: string; email: string; password: string }
): Promise<AxiosResponse> => axios.post('/v1/auth/signup', signUpPayload)

export const fetchAllFeeds = (): Promise<AxiosResponse> => axios.get('/v1/title/all?limit=5')

export const fetchFeaturedEntryByTitleId = (
	titleId: string
): Promise<AxiosResponse> => axios.get(`/v1/entry/${titleId}/featured`)

export const fetchEntriesByTitleId = (
	titleId: string
): Promise<AxiosResponse> => axios.get(`/v1/entry/${titleId}/all?limit=5`)

export const fetchOneCategoryById = (
	categoryId: string
): Promise<AxiosResponse> => axios.get(`/v1/category/${categoryId}`)
