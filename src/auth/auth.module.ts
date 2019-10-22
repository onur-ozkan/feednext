import { Module } from '@nestjs/common';
import { AuthService } from './Service/auth.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './Strategy/local.strategy';
import { AuthController } from './Controller/auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { configService } from '../shared/Config/app.config';
import { JwtStrategy } from './Strategy/jwt.strategy';
import { UserEntity } from '../users/Entity/users.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from '../users/Service/users.service';

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
