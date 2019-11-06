import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PassportModule } from '@nestjs/passport'
import { AuthService } from './Service/auth.service'
import { UsersModule } from '../users/users.module'
import { AuthController } from './Controller/auth.controller'
import { configService } from '../../shared/Services/config.service'
import { JwtStrategy } from './Strategy/jwt.strategy'
import { UserEntity } from '../../shared/Entities/users.entity'
import { RedisService } from '../../shared/Services/redis.service'
import { UserRepository } from '../../shared/Repositories/user.repository'

@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity, UserRepository]),
        UsersModule,
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
    providers: [AuthService, RedisService, JwtStrategy],
    controllers: [AuthController],
})

export class AuthModule {}
