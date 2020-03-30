// Nest dependencies
import { InjectRepository } from '@nestjs/typeorm'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common'

// Other dependencies
import { ExtractJwt, Strategy } from 'passport-jwt'

// Local files
import { UsersRepository } from 'src/shared/Repositories/users.repository'
import { configService } from 'src/shared/Services/config.service'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectRepository(UsersRepository)
        private readonly usersRepository: UsersRepository,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.getEnv('SECRET_KEY'),
            ignoreExpiration: false,
        })
    }

    async validate({ iat, exp, id }): Promise<any> {
        const timeDiff = exp - iat
        if (timeDiff <= 0) {
            throw new UnauthorizedException()
        }

        const user = await this.usersRepository.findOne(id)
        if (!user) {
            throw new UnauthorizedException()
        } else if (!user.is_active) {
            throw new BadRequestException('Account is not active.')
        }

        const data = {
            full_name: user.full_name,
            username: user.username,
            email: user.email,
            created_at: user.created_at,
        }
        return data
    }
}
