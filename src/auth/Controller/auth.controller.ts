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

    @Post('signup')
    @ApiResponse({ status: 201, description: 'Successfully Signed Up' })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @UsePipes(new ValidationPipe())
    async signUp(@Body() dto: CreateUserDto): Promise<CreateUserDto> {
        return this.authService.register(dto);
    }

    @Post('signin')
    @ApiResponse({ status: 201, description: 'Successfully Signed In' })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async signIn(@Body() dto: LoginDto): Promise<LoginDto> {
        const user = await this.authService.validateUser(dto);
        return await this.authService.createToken(user);
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard())
    @Get('signout')
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async signOut(@Request() request): Promise<any> {
        const token = await request.headers.authorization.substring(7);
        return await this.authService.killToken(token);
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard())
    @Get('me')
    @ApiResponse({ status: 200, description: 'Successful Response' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async getLoggedInUser(@Request() request): Promise<object> {
        return request.user;
    }
}
