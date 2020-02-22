import request from '@/utils/request'
import { ListItemDataType } from './data.d'

export async function queryFakeList(params: ListItemDataType): Promise<object> {
	return request('/api/fake_list', {
		params,
	})
}
