import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PassportModule } from '@nestjs/passport'
import { AuthService } from './Service/auth.service'
import { UsersModule } from '../users/users.module'
import { AuthController } from './Controller/auth.controller'
import { configService } from '../shared/Config/config.service'
import { JwtStrategy } from './Strategy/jwt.strategy'
import { UserEntity } from '../users/Entity/users.entity'
import { RedisService } from '../shared/Redis/redis.service'

@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity]),
        UsersModule,
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.registerAsync({
            useFactory: () => {
                return {
                    secret: configService.get('SECRET_KEY'),
                    signOptions: {
                        ...(configService.get('JWT_EXPIRATION_TIME')
                            ? {
                                  expiresIn: Number(
                                      configService.get('JWT_EXPIRATION_TIME'),
                                  ),
                              }
                            : {}),
                    },
                }
            },
        }),
    ],
    providers: [AuthService, RedisService, JwtStrategy],
    controllers: [AuthController],
})

export class AuthModule {}
