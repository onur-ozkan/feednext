import request from '@/services/request'
import { UserRegisterParams } from './index'

export async function fakeRegister(params: UserRegisterParams): Promise<object> {
	return request('/api/register', {
		method: 'POST',
		data: params,
	})
}
