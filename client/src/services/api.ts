import axios from 'axios'
import * as env from 'dotenv'

env.config()

axios.defaults.baseURL = process.env.API_URL

declare interface signUpInterface {
  fullName: string,
  username: string,
  password: string,
  email: string
}

export default {
    signUp: (params: signUpInterface) =>
        axios.post('auth/signup', params, {
            headers: {
                'content-type': 'application/json',
            },
        }),
}