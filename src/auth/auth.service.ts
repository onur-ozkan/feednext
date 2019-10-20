import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Injectable()
export class AuthService {
    constructor(private readonly userService: UsersService,
                private readonly jwtService: JwtService) {}

    async validateUser(userName: string, pass: string) {
        const user: any = await this.userService.findOne(userName);
        if (user && user.password === pass) {
            const {password, ...result} = user;
            return result;
        }
        return null;
    }

    async login(user: any) {
        const payload = {email: user.email, sub: user.userId};
        return {
            accessToken: this.jwtService.sign(payload),
        };
    }

    async register(dto: CreateUserDto): Promise<any> {
        return await this.userService.create(dto);
    }
}
