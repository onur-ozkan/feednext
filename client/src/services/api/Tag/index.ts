import axios, { AxiosResponse } from 'axios'

export const searchTagByName = (searchValue: string): Promise<AxiosResponse> => axios.get(`/v1/tag/search?searchValue=${searchValue}`)
export const fetchTrendingTags = (): Promise<AxiosResponse> => axios.get('/v1/tag/trending')