import axios, { AxiosResponse } from 'axios'

export const fetchOneCategory = (categoryId: string): Promise<AxiosResponse> => axios.get(`/v1/category/${categoryId}`)

export const fetchMainCategories = (): Promise<AxiosResponse> => axios.get('/v1/category/main-categories')

export const fetchChildCategories = (categoryId: string): Promise<AxiosResponse> => axios.get(`/v1/category/${categoryId}/child-categories`)

export const fetchTrendingTags = (): Promise<AxiosResponse> => axios.get('/v1/tag/trending')
