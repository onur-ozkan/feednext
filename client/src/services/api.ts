import axios from 'axios'
import { API_URL } from '../constants/env'

axios.defaults.baseURL = API_URL
axios.defaults.headers.common.accept = 'application/json'

declare interface signUpInterface {
  fullName: string,
  username: string,
  password: string,
  email: string
}

export default {
    signUp: (params: signUpInterface) =>
        axios.post('auth/signup', params),
}