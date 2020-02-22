import request from '@/utils/request'

export async function queryCurrent(): Promise<object> {
	return request('/api/currentUser')
}

export async function queryProvince(): Promise<object> {
	return request('/api/geographic/province')
}

export async function queryCity(province: string): Promise<object> {
	return request(`/api/geographic/city/${province}`)
}

export async function query(): Promise<object> {
	return request('/api/users')
}
