import { fetchUserByUsername } from '@/services/api'
import { GetUserDataResponse } from '@/@types/api'
import { UserPageInitials } from '@/@types/initializations'

export const getUserPageInitialValues = async (username: string): Promise<UserPageInitials> => {
	let user: GetUserDataResponse

	await fetchUserByUsername(username).then((res) => {
		user = res.data
	}).catch((_error) => {})

	return { user }
}
