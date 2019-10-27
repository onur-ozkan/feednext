import { Controller, Post, Body, UsePipes, UseGuards, Get, Request } from '@nestjs/common';
import { AuthService } from '../Service/auth.service';
import { CreateUserDto } from '../../users/Dto/create-user.dto';
import { ValidationPipe } from '../../shared/Pipe/validation.pipe';
import { LoginDto } from '../Dto/login.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('signup')
    @UsePipes(new ValidationPipe())
    async signUp(@Body() dto: CreateUserDto): Promise<CreateUserDto> {
        return this.authService.register(dto);
    }

    @Post('signin')
    async signIn(@Body() dto: LoginDto): Promise<LoginDto> {
        const user = await this.authService.validateUser(dto);
        return await this.authService.createToken(user);
    }

    @UseGuards(AuthGuard())
    @Get('signout')
    async signOut(@Request() request): Promise<any> {
        const token = await request.headers.authorization.substring(7);
        return await this.authService.killToken(token);
    }

    @UseGuards(AuthGuard())
    @Get('me')
    async getLoggedInUser(@Request() request): Promise<object> {
        return request.user;
    }
}
