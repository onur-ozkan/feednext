import {
    Controller,
    Post,
    Body,
    UsePipes,
    UseGuards,
    Get,
    Request,
    HttpException,
    Query,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiUseTags, ApiBearerAuth } from '@nestjs/swagger'
import { AuthService } from '../Service/auth.service'
import { CreateUserDto } from '../Dto/create-user.dto'
import { ValidationPipe } from '../../shared/Pipe/validation.pipe'
import { LoginDto } from '../Dto/login.dto'
import { AccountRecoveryDto } from '../Dto/account-recovery.dto'
import { UserAuthInterface } from '../Interface/user-auth.interface'

@ApiUseTags('v1/auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('signup')
    @UsePipes(new ValidationPipe())
    async signUp(@Body() dto: CreateUserDto): Promise<UserAuthInterface> {
        return this.authService.register(dto)
    }

    @Post('signin')
    async signIn(@Body() dto: LoginDto): Promise<LoginDto> {
        const user = await this.authService.validateUser(dto)
        return await this.authService.createToken(user)
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard())
    @Get('signout')
    async signOut(@Request() request): Promise<any> {
        const token = await request.headers.authorization.substring(7)
        return await this.authService.killToken(token)
    }

    @Post('signin/account-recovery')
    async accountRecovery(@Body() dto: AccountRecoveryDto): Promise<HttpException> {
        return this.authService.accountRecovery(dto)
    }

    @Get('account-verification/')
    async verifyAccount(@Query() query): Promise<any> {
        return this.authService.accountVerification(query.token)
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard())
    @Get('me')
    async getLoggedInUser(@Request() request): Promise<object> {
        return request.user
    }
}
