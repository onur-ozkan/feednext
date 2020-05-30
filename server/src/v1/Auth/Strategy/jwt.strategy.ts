// Nest dependencies
import { InjectRepository } from '@nestjs/typeorm'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common'

// Other dependencies
import { ExtractJwt, Strategy } from 'passport-jwt'

// Local files
import { UsersRepository } from 'src/shared/Repositories/users.repository'
import { configService } from 'src/shared/Services/config.service'
import { UsersEntity } from 'src/shared/Entities/users.entity'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectRepository(UsersRepository)
        private readonly usersRepository: UsersRepository,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.getEnv('SECRET_FOR_ACCESS_TOKEN'),
            ignoreExpiration: false,
        })
    }

    async validate({ iat, exp, username }): Promise<any> {
        const timeDiff = exp - iat
        if (timeDiff <= 0) {
            throw new UnauthorizedException()
        }

        let user: UsersEntity
        try {
            user = await this.usersRepository.findOneOrFail({ username })
        } catch (error) {
            throw new UnauthorizedException()
        }

        if (!user.is_active ) throw new BadRequestException('Account is not active')

        const data = {
            full_name: user.full_name,
            username: user.username,
            email: user.email,
            created_at: user.created_at,
        }
        return data
    }
}
