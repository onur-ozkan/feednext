// Nest dependencies
import { UnauthorizedException, BadRequestException } from '@nestjs/common'

// Other dependencies
import * as jwt from 'jsonwebtoken'
import { configService } from './config.service'

export class JwtManipulationService {
    public decodeJwtToken(token: string, property: string): any {
        let result
        try {
            if (!token) throw new Error()
            let decodedJwtData
            try {
                decodedJwtData = jwt.verify(token.split(' ')[1], configService.getEnv('SECRET_FOR_ACCESS_TOKEN'))
            } catch (error) {
                throw new BadRequestException('Token signature is not valid')
            }

            if (property === 'all') result = decodedJwtData
            else result = decodedJwtData[property]
        } catch {
            throw new UnauthorizedException()
        }

        return result
    }
}

const jwtManipulationService = new JwtManipulationService()

export { jwtManipulationService }
