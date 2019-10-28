import { Injectable, BadRequestException, UnprocessableEntityException, NotFoundException, HttpStatus, HttpException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { configService } from '../../shared/Config/config.service';
import { CreateUserDto } from '../Dto/create-user.dto';
import { UserEntity } from '../../users/Entity/users.entity';
import { LoginDto } from '../Dto/login.dto';
import { RedisService } from '../../shared/Redis/redis.service';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Validator } from 'class-validator';
import { VerifyEmailDto } from '../Dto/verify-email.dto';
import { Serializer } from 'jsonapi-serializer';
import { UserAuthInterface } from '../Interface/user-auth.interface';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
    constructor(private readonly jwtService: JwtService,
                private readonly redisService: RedisService,
                @InjectRepository(UserEntity)
                private readonly userRepository: Repository<UserEntity>,
    ) {}

    async validateUser(dto: LoginDto): Promise<any> {
        const passHash = crypto.createHmac('sha256', dto.password).digest('hex');

        if (dto.email) {
            await this.validateEmail(dto.email);
            try {
                return await this.userRepository.findOneOrFail({email: dto.email, password: passHash});
            } catch (err) {
                throw new NotFoundException('User does not exist.');
            }
        }

        try {
            return await this.userRepository.findOneOrFail({username: dto.username, password: passHash});
        } catch (err) {
            throw new NotFoundException('User does not exist.');
        }
    }

    async verifyEmail(dto: VerifyEmailDto): Promise<HttpException> {
        await this.validateEmail(dto.email);
        try {
            await this.userRepository.findOneOrFail({email: dto.email});
        } catch (err) {
            throw new NotFoundException('Email does not exist in the database.');
        }
        throw new HttpException('OK', HttpStatus.OK);
    }

    async validateEmail(incEmail: string): Promise<any> {
        const validator = new Validator();
        if (validator.isEmail(incEmail)) {
            return;
        }
        throw new BadRequestException('Email is not an email.');
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

    async register(dto: CreateUserDto): Promise<UserAuthInterface> {
        // Create new user
        const newUser = new UserEntity({
          email: dto.email,
          username: dto.username,
          password: dto.password,
          fullName: dto.fullName,
        });

        try {
          const result = await this.userRepository.save(newUser);
          return await new Serializer('user-identities', { attributes: ['fullName', 'username', 'email', 'accessToken'] }).serialize(result);
        } catch (err) {
          throw new UnprocessableEntityException(err.errmsg);
        }
      }
}
