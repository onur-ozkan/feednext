import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PassportModule } from '@nestjs/passport'
import { AuthService } from './Service/auth.service'
import { UserModule } from '../User/user.module'
import { AuthController } from './Controller/auth.controller'
import { configService } from '../../shared/Services/config.service'
import { JwtStrategy } from './Strategy/jwt.strategy'
import { UsersEntity } from '../../shared/Entities/users.entity'
import { RedisService } from '../../shared/Services/redis.service'
import { UsersRepository } from '../../shared/Repositories/users.repository'
import { MailService } from '../../shared/Services/mail.service'

@Module({
    imports: [
        TypeOrmModule.forFeature([UsersEntity, UsersRepository]),
        UserModule,
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.registerAsync({
            useFactory: () => {
                return {
                    secret: configService.get('SECRET_KEY'),
                    signOptions: {
                        ...({ expiresIn: Number(configService.get('JWT_EXPIRATION_TIME')) }),
                    },
                }
            },
        }),
    ],
    providers: [AuthService, RedisService,  MailService, JwtStrategy],
    controllers: [AuthController],
})

export class AuthModule {}
