import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { UsersService } from '../../users/Service/users.service';
import { JwtService } from '@nestjs/jwt';
import { configService } from '../../shared/Config/config.service';
import { CreateUserDto } from '../../users/Dto/create-user.dto';
import { UserEntity } from '../../users/Entity/users.entity';
import { LoginDto } from '../Dto/login.dto';
import { RedisService } from '../../shared/Redis/redis.service';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Validator } from 'class-validator';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
    constructor(private readonly userService: UsersService,
                private readonly jwtService: JwtService,
                private readonly redisService: RedisService,
                @InjectRepository(UserEntity)
                private readonly userRepository: Repository<UserEntity>,
    ) {}

    async validateUser(dto: LoginDto): Promise<any> {
        const passHash = crypto.createHmac('sha256', dto.password).digest('hex');

        if (dto.email) {
            if (!await this.validateEmail(dto.email)) {
                throw new BadRequestException('Email is not an email.');
            }
            try {
                return await this.userRepository.findOneOrFail({email: dto.email, password: passHash});
            } catch (err) {
                throw new UnauthorizedException('User does not exist.');
            }
        }

        try {
            return await this.userRepository.findOneOrFail({username: dto.username, password: passHash});
        } catch (err) {
            throw new UnauthorizedException('User does not exist.');
        }
    }

    async validateEmail(incEmail: string): Promise<boolean> {
        const validator = new Validator();
        return validator.isEmail(incEmail);
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
