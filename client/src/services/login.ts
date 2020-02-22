import request from '@/utils/request'

export interface LoginParamsType {
	userName: string
	password: string
	mobile: string
	captcha: string
}

export async function fakeAccountLogin(params: LoginParamsType): Promise<object> {
	return request('/api/login/account', {
		method: 'POST',
		data: params,
	})
}

export async function getFakeCaptcha(mobile: string): Promise<object> {
	return request(`/api/login/captcha?mobile=${mobile}`)
}
