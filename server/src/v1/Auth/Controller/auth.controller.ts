// Nest dependencies
import { Controller, Headers, Post, Body, UseGuards, Get, Put, Request, HttpException, Query } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiUseTags, ApiBearerAuth } from '@nestjs/swagger'

// Local files
import { OkException } from 'src/shared/Filters/ok-exception.filter'
import { AuthService } from '../Service/auth.service'
import { CreateAccountDto } from '../Dto/create-account.dto'
import { LoginDto } from '../Dto/login.dto'
import { AccountRecoveryDto } from '../Dto/account-recovery.dto'
import { currentUserService } from 'src/shared/Services/current-user.service'
import { serializerService } from 'src/shared/Services/serializer.service'

@ApiUseTags(`v1/auth`)
@Controller()
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post(`signup`)
    signUp(@Body() dto: CreateAccountDto): Promise<HttpException> {
        return this.authService.signUp(dto)
    }

    @Post(`signin`)
    async signIn(@Body() dto: LoginDto): Promise<HttpException> {
        const user = await this.authService.validateUser(dto)
        return await this.authService.signIn(user)
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard(`jwt`))
    @Get(`signout`)
    async signOut(@Request() request): Promise<HttpException> {
        const token = await request.headers.authorization.substring(7)
        return await this.authService.signOut(token)
    }

    @Put(`signin/account-recovery`)
    accountRecovery(@Body() dto: AccountRecoveryDto): Promise<HttpException> {
        return this.authService.accountRecovery(dto)
    }

    @Get(`account-verification`)
    verifyAccount(@Query(`token`) token: string): Promise<HttpException> {
        return this.authService.accountVerification(token)
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard(`jwt`))
    @Get(`me`)
    async getLoggedInUser(@Headers(`authorization`) bearer: string): Promise<HttpException> {
        const data = await currentUserService.getCurrentUser(bearer, `all`)
        serializerService.deleteProperties(data, [`iat`, `exp`])
        throw new OkException(`profile`, data)
    }
}
