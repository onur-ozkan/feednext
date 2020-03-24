import request from '@/utils/request'
import { FormDataType } from './index'

export async function fakeAccountLogin(params: FormDataType): Promise<object> {
	return request('/api/login/account', {
		method: 'POST',
		data: params,
	})
}
