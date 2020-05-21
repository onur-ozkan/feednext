import axios, { AxiosResponse } from 'axios'

export const updateUser = (accessToken: string, payload: {
	fullName?: string,
	email?: string,
	biography?: string,
	oldPassword?: string,
	password?: string
}): Promise<AxiosResponse> => axios.patch('v1/user/update', payload, {
	headers: {
		'Authorization': `Bearer ${accessToken}`,
	}
})

export const uploadProfilePicture = (file: any, accessToken: string):
	Promise<AxiosResponse> => axios.put('v1/user/pp', file, {
		headers: {
			'Authorization': `Bearer ${accessToken}`,
		}
	})

export const fetchUserByUsername = (username: string): Promise<AxiosResponse> => axios.get(`/v1/user/${username}`)

export const verifyUpdatedEmail = (token: string): Promise<AxiosResponse> => axios.get('/v1/user/verify-updated-email', {
	params: {
		token
	}
})

export const fetchUserVotes = (
	username: string,
	voteType: 'up' | 'down',
	skip: number
): Promise<AxiosResponse> => axios.get(
	`/v1/user/${username}/votes`, {
		params: {
			voteType,
			skip
		}
	}
)

export const searchUser = (searchValue: string): Promise<AxiosResponse> => axios.get(`/v1/user/search?searchValue=${searchValue}`)
