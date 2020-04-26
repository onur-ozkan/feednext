// Nest dependencies
import { UnauthorizedException } from '@nestjs/common'

// Other dependencies
import * as jwt from 'jsonwebtoken'

export class JwtManipulationService {
    public decodeJwtToken(token: string, property: string): any {
        let result
        try {
            if (!token) throw new Error()
            const decodedJwtData: any = jwt.decode(token.split(' ')[1])

            if (property === 'all') result = decodedJwtData
            result = decodedJwtData[property]
        } catch {
            throw new UnauthorizedException()
        }

        return result
    }
}

const jwtManipulationService = new JwtManipulationService()

export { jwtManipulationService }
