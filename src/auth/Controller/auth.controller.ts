import { Controller, Post, UseGuards, Request, Body, UsePipes } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../Service/auth.service';
import { CreateUserDto } from '../../users/Dto/create-user.dto';
import { ValidationPipe } from '../../shared/Pipe/validation.pipe';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @UseGuards(AuthGuard('local'))
    @Post('login')
    async login(@Request() req) {
        return this.authService.login(req.user);
    }

    @Post('register')
    @UsePipes(new ValidationPipe())
    async register(@Body() dto: CreateUserDto) {
        return this.authService.register(dto);
    }
}
