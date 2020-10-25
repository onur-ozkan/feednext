// Other dependencies
import axios from 'axios'

// Local files
import { API_URL } from '@/../config/constants'

axios.defaults.baseURL = API_URL

export * from './Auth'
export * from './Tag'
export * from './Entry'
export * from './Message'
export * from './Title'
export * from './User'
