import axios, { AxiosResponse } from 'axios'
import { getConstant } from '../../config/config'

axios.defaults.baseURL = getConstant('API_URL')

export default {
	signIn: (obj: { username?: string; email?: string; password: string }): Promise<AxiosResponse> =>
		axios.post('/v1/auth/signin', obj),
}
