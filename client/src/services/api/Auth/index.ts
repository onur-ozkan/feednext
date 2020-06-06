// Other dependencies
import axios, { AxiosResponse } from 'axios'

export const signIn = (
	payload: { username?: string; email?: string; rememberMe: boolean; password: string }
): Promise<AxiosResponse> => axios.post('/v1/auth/signin', payload, { withCredentials: true })

export const signUp = (
	payload: { fullName: string; username: string; email: string; password: string }
): Promise<AxiosResponse> => axios.post('/v1/auth/signup', payload)

export const checkAccessToken = (accessToken: string): Promise<AxiosResponse>  => axios.get('v1/auth/check-token',
{
	headers: {
		'Authorization': `Bearer ${accessToken}`,
	}
})

export const generateRecoveryKey = (email: string): Promise<AxiosResponse> => axios.patch('/v1/auth/generate-recovery-key', { email })

export const recoverAccountWithKey = (payload: {
	email: string,
	recoveryKey: string,
	password: string
}): Promise<AxiosResponse> => axios.patch('/v1/auth/recover-account', payload)

export const verifyAccount = (token: string): Promise<AxiosResponse> => axios.get('/v1/auth/account-verification', {
	params: {
		token
	}
})

export const refreshToken = (): Promise<AxiosResponse> => axios.get('/v1/auth/refresh-token', { withCredentials: true })
