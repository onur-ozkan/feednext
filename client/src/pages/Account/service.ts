import request from '@/utils/request'

export async function queryProjectNotice(): Promise<object> {
	return request('/api/project/notice')
}

export async function queryActivities(): Promise<object> {
	return request('/api/activities')
}

export async function fakeChartData(): Promise<object> {
	return request('/api/fake_chart_data')
}

export async function queryCurrent(): Promise<object> {
	return request('/api/currentUser')
}
