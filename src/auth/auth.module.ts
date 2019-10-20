import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { configService } from '../shared/config/config.service';
import { JwtStrategy } from './jwt.strategy';
import { UserEntity } from '../users/users.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from '../users/users.service';

@Module({
    imports: [
        UsersModule,
        PassportModule,
        JwtModule.register({
            secret: configService.getSecretKey(),
            signOptions: { expiresIn: '3600s' },
        }),
        TypeOrmModule.forFeature([UserEntity]),
    ],
    providers: [
        AuthService,
        LocalStrategy,
        JwtStrategy,
        UsersService,
    ],
    controllers: [AuthController],
})
export class AuthModule {}
