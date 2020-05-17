// Other dependencies
import axios, { AxiosResponse } from 'axios'

export const signIn = (
	signInPayload: { username?: string; email?: string; rememberMe: boolean; password: string }
): Promise<AxiosResponse> => axios.post('/v1/auth/signin', signInPayload, { withCredentials: true })

export const signUp = (
	signUpPayload: { fullName: string; username: string; email: string; password: string }
): Promise<AxiosResponse> => axios.post('/v1/auth/signup', signUpPayload)

export const checkAccessToken = (accessToken: string): Promise<AxiosResponse>  => axios.get('v1/auth/check-token',
{
	headers: {
		'Authorization': `Bearer ${accessToken}`,
	}
})

export const refreshToken = (): Promise<AxiosResponse> => axios.get('/v1/auth/refresh-token', { withCredentials: true })
