// Nest dependencies
import { APP_INTERCEPTOR, APP_GUARD } from '@nestjs/core'
import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PassportModule } from '@nestjs/passport'

// Other dependencies
import { RateLimiterModule, RateLimiterInterceptor } from 'nestjs-fastify-rate-limiter'

// Local files
import { UsersEntity } from 'src/shared/Entities/users.entity'
import { RedisService } from 'src/shared/Services/redis.service'
import { UsersRepository } from 'src/shared/Repositories/users.repository'
import { MailService } from 'src/shared/Services/mail.service'
import { AuthService } from './Service/auth.service'
import { UserModule } from '../User/user.module'
import { AuthController } from './Controller/auth.controller'
import { JwtStrategy } from './Strategy/jwt.strategy'
import { configService } from 'src/shared/Services/config.service'
import { RolesGuard } from 'src/shared/Guards/roles.guard'

@Module({
    imports: [
        TypeOrmModule.forFeature([UsersEntity, UsersRepository]),
        UserModule,
        RateLimiterModule,
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.registerAsync({
            useFactory: () => {
                return {
                    secret: configService.getEnv('SECRET_FOR_ACCESS_TOKEN'),
                    signOptions: {
                        ...({ expiresIn: configService.getEnv('JWT_EXPIRATION_TIME') }),
                    },
                }
            },
        }),
    ],
    controllers: [AuthController],
    providers: [
        AuthService,
        RedisService,
        MailService,
        JwtStrategy,
        {
            provide: APP_INTERCEPTOR,
            useClass: RateLimiterInterceptor,
        },
        {
            provide: APP_GUARD,
            useClass: RolesGuard
        }
    ]
})

export class AuthModule {}
