import { Module } from '@nestjs/common';
import { AuthService } from './Service/auth.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './Controller/auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { configService } from '../shared/Config/app.config';
import { JwtStrategy } from './Strategy/jwt.strategy';
import { UserEntity } from '../users/Entity/users.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [
        UsersModule,
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.registerAsync({
            useFactory: async () => {
              return {
                secret: configService.getSecretKey(),
                signOptions: {
                  ...(
                    configService.getJwtExpireTime() ? { expiresIn: Number(configService.getJwtExpireTime()) } : {}
                  ),
                },
              };
            },
          }),
        TypeOrmModule.forFeature([UserEntity]),
    ],
    providers: [
        AuthService,
        JwtStrategy,
    ],
    controllers: [AuthController],
    exports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
    ],
})
export class AuthModule {}
