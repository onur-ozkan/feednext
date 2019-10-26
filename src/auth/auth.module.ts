import { Module } from '@nestjs/common';
import { AuthService } from './Service/auth.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './Controller/auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { configService } from '../shared/Config/config.service';
import { JwtStrategy } from './Strategy/jwt.strategy';
import { UserEntity } from '../users/Entity/users.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisService } from '../shared/Redis/redis.service';

@Module({
    imports: [
        UsersModule,
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.registerAsync({
            useFactory: async () => {
              return {
                secret: configService.get('SECRET_KEY'),
                signOptions: {
                  ...(
                    configService.get('JWT_EXPIRATION_TIME') ? { expiresIn: Number(configService.get('JWT_EXPIRATION_TIME')) } : {}
                  ),
                },
              };
            },
          }),
        TypeOrmModule.forFeature([UserEntity]),
    ],
    providers: [
        AuthService,
        RedisService,
        JwtStrategy,
    ],
    controllers: [AuthController],
})
export class AuthModule {}
