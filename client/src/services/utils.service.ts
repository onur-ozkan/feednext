// Antd dependencies
import { message } from 'antd'

// Local files
import { persistor } from '@/redux/store'

export const handleSessionExpiration = async (): Promise<void> => {
	// await persistor.purge()
	location.href = '/auth/sign-in'
	message.info('User session has been expired, please Sign in again')
}
