import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../../users/Service/users.service';
import { JwtService } from '@nestjs/jwt';
import { configService } from '../../shared/Config/config.service';
import { CreateUserDto } from '../../users/Dto/create-user.dto';
import { UserEntity } from '../../users/Entity/users.entity';
import { LoginDto } from '../Dto/login.dto';
import { RedisService } from '../../shared/Redis/redis.service';

@Injectable()
export class AuthService {
    constructor(private readonly userService: UsersService,
                private readonly jwtService: JwtService,
                private readonly redisService: RedisService,
    ) {}

    async validateUser(dto: LoginDto): Promise<any> {
        const user = await this.userService.userValidation(dto.email, dto.username, dto.password);
        if (!user) {
            throw new UnauthorizedException('User does not exist.');
        }
        return user;
    }

    async createToken(userEntity: UserEntity): Promise<any> {

        const token = this.jwtService.sign({
            _id: userEntity._id,
            username: userEntity.username,
            email: userEntity.email,
            createdAt: userEntity.createdAt,
        });

        return {
          expiresIn: configService.get('JWT_EXPIRATION_TIME'),
          accessToken: token,
          user: userEntity,
        };
    }

    async killToken(token: string) {
        const decodedToken = this.jwtService.decode(token);
        // tslint:disable-next-line:no-string-literal
        const expireDate =  decodedToken['exp'];
        const remainingSeconds = Math.round(expireDate - (Date.now() / 1000));

        await this.redisService.setOnlyKey(token, remainingSeconds);
    }

    async register(dto: CreateUserDto): Promise<any> {
        return await this.userService.create(dto);
    }
}
