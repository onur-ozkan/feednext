import axios, { AxiosResponse } from 'axios'
import { getConstant } from '../../config/constants'

axios.defaults.baseURL = getConstant('API_URL')

export default {
	signIn: (obj: { username?: string; email?: string; password: string }): Promise<AxiosResponse> =>
		axios.post('/v1/auth/signin', obj),
	signUp: (obj: { fullName: string; username: string; email: string; password: string }): Promise<AxiosResponse> =>
		axios.post('/v1/auth/signup', obj),
	fetchAllFeeds: (): Promise<AxiosResponse> => axios.get('/v1/title/all?limit=5'),
	fetchFeaturedEntryByTitleId: (titleId: string): Promise<AxiosResponse> => axios.get(`/v1/entry/${titleId}/featured`),
	fetchEntriesByTitleId: (titleId: string): Promise<AxiosResponse> => axios.get(`/v1/entry/${titleId}/all?limit=5`),
	fetchOneCategoryById: (categoryId: string): Promise<AxiosResponse> => axios.get(`/v1/category/${categoryId}`),
}
