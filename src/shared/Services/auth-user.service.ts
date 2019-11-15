import * as jwt from 'jsonwebtoken'

export class AuthUserService {
    public getUserData(token: string, property: string): any {
        const authData: any = jwt.decode(token.substring(7))

        switch (property) {
            case 'id': return authData._id
            case 'username': return authData.username
            case 'email': return authData.email
            case 'all': return authData
        }
    }
}

const authUserService = new AuthUserService()

export { authUserService }
