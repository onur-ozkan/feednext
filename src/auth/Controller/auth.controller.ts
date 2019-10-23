import { Controller, Post, Body, UsePipes, UseGuards, Get, Request } from '@nestjs/common';
import { ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from '../Service/auth.service';
import { CreateUserDto } from '../../users/Dto/create-user.dto';
import { ValidationPipe } from '../../shared/Pipe/validation.pipe';
import { LoginDto } from '../Dto/login.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('signin')
    @ApiResponse({ status: 201, description: 'Successfully Signed In' })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async login(@Body() dto: LoginDto): Promise<any> {
        const user = await this.authService.validateUser(dto);
        return await this.authService.createToken(user);
    }

    @Post('signup')
    @ApiResponse({ status: 201, description: 'Successfully Signed Up' })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @UsePipes(new ValidationPipe())
    async register(@Body() dto: CreateUserDto): Promise<any> {
        return this.authService.register(dto);
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard())
    @Get('me')
    @ApiResponse({ status: 200, description: 'Successful Response' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async getLoggedInUser(@Request() request): Promise<any> {
        return request.user;
    }
}
