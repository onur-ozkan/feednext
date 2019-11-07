import {
    Controller,
    Post,
    Body,
    UseGuards,
    Get,
    Request,
    HttpException,
    Query,
    HttpStatus,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiUseTags, ApiBearerAuth } from '@nestjs/swagger'
import { AuthService } from '../Service/auth.service'
import { CreateAccountDto } from '../Dto/create-account.dto'
import { LoginDto } from '../Dto/login.dto'
import { AccountRecoveryDto } from '../Dto/account-recovery.dto'

@ApiUseTags('v1/auth')
@Controller()
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('signup')
    async signUp(@Body() dto: CreateAccountDto): Promise<HttpException> {
        return this.authService.signup(dto)
    }

    @Post('signin')
    async signIn(@Body() dto: LoginDto): Promise<HttpException> {
        const user = await this.authService.validateUser(dto)
        return await this.authService.createToken(user)
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard())
    @Get('signout')
    async signOut(@Request() request): Promise<HttpException> {
        const token = await request.headers.authorization.substring(7)
        return await this.authService.killToken(token)
    }

    @Post('signin/account-recovery')
    async accountRecovery(@Body() dto: AccountRecoveryDto): Promise<HttpException> {
        return this.authService.accountRecovery(dto)
    }

    @Get('account-verification')
    async verifyAccount(@Query() query): Promise<HttpException> {
        return this.authService.accountVerification(query.token)
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard())
    @Get('me')
    async getLoggedInUser(@Request() request): Promise<HttpException> {
        throw new HttpException({statusCode: 200, message: 'OK', data: request.user}, HttpStatus.OK )
    }
}
