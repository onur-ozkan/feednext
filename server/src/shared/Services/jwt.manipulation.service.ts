// Nest dependencies
import { UnauthorizedException } from '@nestjs/common'

// Other dependencies
import * as jwt from 'jsonwebtoken'

export class JwtManipulationService {
    public decodeJwtToken(token: string, property: string): any {
        if (!token) throw new UnauthorizedException()
        const decodedJwtData: any = jwt.decode(token.split(' ')[1])

        if (property === 'all') return decodedJwtData
        return decodedJwtData[property]
    }
}

const jwtManipulationService = new JwtManipulationService()

export { jwtManipulationService }
