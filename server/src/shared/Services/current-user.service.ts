import { UnauthorizedException } from '@nestjs/common'
import * as jwt from 'jsonwebtoken'

export class CurrentUserService {
    public getCurrentUser(token: string, property: string): any {
        if (!token) throw new UnauthorizedException()
        const authData: any = jwt.decode(token.substring(7))

        switch (property) {
            case 'id': return authData.id
            case 'username': return authData.username
            case 'email': return authData.email
            case 'role': return authData.role
            case 'all': return authData
        }
    }
}

const currentUserService = new CurrentUserService()

export { currentUserService }
