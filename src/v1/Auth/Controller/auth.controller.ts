import {
    Controller,
    Post,
    Body,
    UseGuards,
    Get,
    Request,
    HttpException,
    Query,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiUseTags, ApiBearerAuth } from '@nestjs/swagger'
import { OkException } from 'src/shared/Exceptions/ok.exception'
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
        return this.authService.signUp(dto)
    }

    @Post('signin')
    async signIn(@Body() dto: LoginDto): Promise<HttpException> {
        const user = await this.authService.validateUser(dto)
        return await this.authService.signIn(user)
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
    @Get('signout')
    async signOut(@Request() request): Promise<HttpException> {
        const token = await request.headers.authorization.substring(7)
        return await this.authService.signOut(token)
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
    @UseGuards(AuthGuard('jwt'))
    @Get('me')
    async getLoggedInUser(@Request() request): Promise<HttpException> {
        const data = await request.user
        throw new OkException(`profile`, data)
    }
}
